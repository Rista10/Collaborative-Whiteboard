"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { CanvasState, CanvasMode, LayerType, Point, Color } from "@/types/canvas";
import { Participants } from "./participants";
import { ToolBar } from "./toolbar";
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useSelf } from "@liveblocks/react/suspense";
import { useStorage } from "@liveblocks/react/suspense";
import { LayerPreview } from "./layerPreview";
import { connectionIdToColor, penPointsToPathLayer } from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";
import { nanoid } from "nanoid";
import { ColorPicker } from "./colorPicker";

export const Canvas = () => {
  const layerIds = useStorage((root) => root.layerIds);
  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({ r: 255, g: 0, b: 0 });
  const pencilDraft = useSelf((self) => self.presence.pencilDraft);

  const selections = useOthersMapped((other) => other.presence.selection);

  const selection = useSelf((me) => me.presence.selection);
  const selfSelection = useMemo(() => selection || [], [selection]);

  const layerIdsToColorSelection = useMemo(() => {
    const mapping: Record<string, string> = {};
    for (const [connectionId, selection] of selections) {
      for (const layerId of selection) {
        mapping[layerId] = connectionIdToColor(connectionId);
      }
    }
    for (const layerId of selfSelection) {
      mapping[layerId] = "blue";
    }
    return mapping;
  }, [selections, selfSelection]);

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const clearCanvas = useMutation(({ storage }) => {
    const layers = storage.get("layers");
    const layerIds = storage.get("layerIds");
    if (layers) Array.from(layers.keys()).forEach((key) => layers.delete(key));
    if (layerIds) layerIds.clear();
  }, []);

  const pointerEventToCanvasPoint = useCallback((e: React.PointerEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y]],
        pencilColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );

  const continueDrawing = useMutation(
    ({ setMyPresence }, point: Point) => {
      setMyPresence({
        pencilDraft: pencilDraft ? [...pencilDraft, [point.x, point.y]] : [[point.x, point.y]],
      });
    },
    [pencilDraft]
  );

  const translateShape = useMutation(({ self, storage, setMyPresence }, delta: Point) => {
    const liveLayers = storage.get("layers");
    const selectedLayerIds = self.presence.selection;

    for (const layerId of selectedLayerIds) {
      const layer = liveLayers.get(layerId);
      if (layer) {
        layer.update({
          x: layer.get("x") + delta.x,
          y: layer.get("y") + delta.y,
        });
      }
    }

    setMyPresence({ selection: selectedLayerIds }, { addToHistory: true });
  }, []);

  const insertLayer = useMutation(({ storage, setMyPresence }, layerType: LayerType.Circle | LayerType.Rectangle, position: Point) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");
    const layerId = nanoid();

    const layer = new LiveObject({
      type: layerType,
      x: position.x,
      y: position.y,
      width: 100,
      height: 100,
      fill: lastUsedColor,
    });

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);
    setMyPresence({ selection: [layerId] }, { addToHistory: true });
    setCanvasState({ mode: CanvasMode.None });
  }, [lastUsedColor]);

  const insertPath = useMutation(({ storage, self, setMyPresence }) => {
    const liveLayers = storage.get("layers");
    const { pencilDraft } = self.presence;

    if (!pencilDraft || pencilDraft.length < 2) {
      setMyPresence({ pencilDraft: null, pencilColor: null });
      return
    }
    const layerId = nanoid();

    if (pencilDraft) {
      liveLayers.set(
        layerId,
        new LiveObject(penPointsToPathLayer(pencilDraft, self.presence.pencilColor || lastUsedColor))
      );
    }

    const liveLayerIds = storage.get("layerIds");
    liveLayerIds.push(layerId);

    setMyPresence({ pencilDraft: null });
    setCanvasState({
      mode: CanvasMode.Pencil,
    });

  }, [lastUsedColor]);

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
    }
  }, []);


  const handlePointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
    e.preventDefault();
    const point = pointerEventToCanvasPoint(e);
    setMyPresence({ cursor: point });

    if (canvasState.mode === CanvasMode.Pressing) {
      startMultiSelection(point, canvasState.origin);
    } else if (canvasState.mode === CanvasMode.Pencil && pencilDraft) {
      continueDrawing(point);
    } else if (canvasState.mode === CanvasMode.Translating && canvasState.current) {
      translateShape({ x: point.x - canvasState.current.x, y: point.y - canvasState.current.y });
      setCanvasState({ ...canvasState, current: point });
    }

  }, [canvasState, pencilDraft, continueDrawing, translateShape, startMultiSelection, pointerEventToCanvasPoint]);

  const handlePointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const handlePointerUp = useMutation(({ }, e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e);

    if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layer, point);
    } else if (canvasState.mode === CanvasMode.Pencil) {
      insertPath();
    }

    setCanvasState({ mode: CanvasMode.None });
    history.resume();
  }, [canvasState, insertLayer, insertPath]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e);

    if (canvasState.mode === CanvasMode.Pencil) {
      startDrawing(point);
      return;
    }

    if (canvasState.mode === CanvasMode.Inserting) return;
    setCanvasState({
      origin: point,
      mode: CanvasMode.Pressing,
    });

  }, [canvasState.mode, startDrawing, pointerEventToCanvasPoint]);

  const handleLayerPointerDown = useMutation(({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
    if ([CanvasMode.Pencil, CanvasMode.Inserting].includes(canvasState.mode)) return;

    history.pause();
    e.stopPropagation();

    if (!self.presence.selection?.includes(layerId)) {
      setMyPresence({ selection: [layerId] }, { addToHistory: true });
    }

    const point = pointerEventToCanvasPoint(e);
    setCanvasState({
      mode: CanvasMode.Translating,
      current: point,
    });
  }, [history, canvasState.mode, pointerEventToCanvasPoint]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) {
          history.redo();
        } else {
          history.undo();
        }

      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [history]);

  return (
    <div className="h-full w-full relative bg-neutral-100 touch-none">
      <div className="absolute top-3 left-0 right-0 z-10">
        <h1 className="text-center text-xl font-semibold p-1">Welcome To Collaborative Board</h1>
        <p className="text-center text-md text-gray-500">Use the toolbar to draw and collaborate with your team</p>
        <Participants />
      </div>
      <ColorPicker
        color={lastUsedColor}
        onChange={(color: Color) => {
          setLastUsedColor(color);
        }}
      />

      <ToolBar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={history.undo}
        redo={history.redo}
        clearCanvas={clearCanvas}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <svg
        className="h-[100vh] w-[100vw]"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <g>
          {layerIds?.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={handleLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}

          {canvasState.mode === CanvasMode.SelectionNet && canvasState.current && (
            <rect
              className="fill-blue-500/5 stroke-blue-500 stroke-1 pointer-events-none"
              x={Math.min(canvasState.origin.x, canvasState.current.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
            />
          )}
          {pencilDraft && (
            <path
              d={
                pencilDraft.length > 0
                  ? `M ${pencilDraft[0][0]} ${pencilDraft[0][1]}${pencilDraft
                    .slice(1)
                    .map(([x, y]) => ` L ${x} ${y}`)
                    .join("")}`
                  : ""
              }
              className="stroke-2 "
              style={{
                stroke: `rgb(${lastUsedColor.r}, ${lastUsedColor.g}, ${lastUsedColor.b})`,
              }}
              fill="none"
            />
          )}

        </g>
      </svg>
    </div>
  );
};
