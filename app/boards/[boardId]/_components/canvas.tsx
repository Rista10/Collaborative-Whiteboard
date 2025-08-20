"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { CanvasState, CanvasMode, LayerType, Point, Color } from "@/types/canvas";
import { Participants } from "./participants";
import { ToolBar } from "./toolbar";
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useSelf } from "@liveblocks/react/suspense";
import { useStorage } from "@liveblocks/react/suspense";
import { LayerPreview } from "./layerPreview";
import { connectionIdToColor, colorToCss } from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";
import { nanoid } from "nanoid";

export const Canvas = () => {
  const layerIds = useStorage((root) => root.layerIds);
  const [canvasState, setCanvasState] = useState<CanvasState>({ mode: CanvasMode.None });
  const [lastUsedColor] = useState<Color>({ r: 255, g: 0, b: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  const selections = useOthersMapped((other) => other.presence.selection);
  const selfSelection = useSelf((me) => me.presence.selection) || [];

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
    layerIds?.clear?.();
  }, []);

  const pointerEventToCanvasPoint = useCallback((e: React.PointerEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
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

  const insertPath = useMutation(({ storage }) => {
    const layerIds = storage.get("layerIds");
    // implement insert path logic
  }, [currentStroke, lastUsedColor]);

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
    }
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e);

    if (canvasState.mode === CanvasMode.Pencil) {
      setCurrentStroke([point]);
      setIsDrawing(true);
      return;
    }

    if (![CanvasMode.Inserting, CanvasMode.Pencil].includes(canvasState.mode)) {
      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    }
  }, [canvasState.mode]);

  const handlePointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
    e.preventDefault();
    const point = pointerEventToCanvasPoint(e);
    setMyPresence({ cursor: point });

    if (canvasState.mode === CanvasMode.Pressing) {
      startMultiSelection(point, canvasState.origin);
    }

    if (canvasState.mode === CanvasMode.Pencil && isDrawing) {
      setCurrentStroke((prev) => [...prev, point]);
    }
  }, [canvasState, isDrawing]);

  const handlePointerLeave = useMutation(({ setMyPresence }) => {
    if (canvasState.mode === CanvasMode.Pencil && isDrawing && currentStroke.length > 1) {
    insertPath();
  }
  
  if (canvasState.mode === CanvasMode.Pencil) {
    setIsDrawing(false);
    setCurrentStroke([]);
  }
}, [canvasState.mode, isDrawing, currentStroke, insertPath]);

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

  const handleLayerPointerDown = useMutation(({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
    if ([CanvasMode.Pencil, CanvasMode.Inserting].includes(canvasState.mode)) return;

    history.pause();
    e.stopPropagation();
    if (!self.presence.selection?.includes(layerId)) {
      setMyPresence({ selection: [layerId] }, { addToHistory: true });
    }
  }, [history, canvasState.mode]);

  // --- Keyboard undo/redo ---
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.shiftKey ? history.redo() : history.undo();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [history]);

  return (
    <div className="h-full w-full relative bg-neutral-100 touch-none">
      <Participants />
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

          {/* Selection net */}
          {canvasState.mode === CanvasMode.SelectionNet && canvasState.current && (
            <rect
              className="fill-blue-500/5 stroke-blue-500 stroke-1 pointer-events-none"
              x={Math.min(canvasState.origin.x, canvasState.current.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
            />
          )}

          {/* Temporary Pencil stroke */}
          {canvasState.mode === CanvasMode.Pencil && isDrawing && currentStroke.length > 1 && (
            <polyline
              points={currentStroke.map(p => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={colorToCss(lastUsedColor)}
              strokeWidth={2}
            />
          )}
        </g>
      </svg>
    </div>
  );
};
