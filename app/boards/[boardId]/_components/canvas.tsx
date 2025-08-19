"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { CanvasState, CanvasMode, LayerType, Point, Color } from "@/types/canvas";
import { Participants } from "./participants";
import { ToolBar } from "./toolbar";
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped } from "@liveblocks/react/suspense";
import { useStorage } from "@liveblocks/react/suspense";
import { LayerPreview } from "./layerPreview";
import { connectionIdToColor } from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";
import { nanoid } from "nanoid";

export const Canvas = ({ boardId }: { boardId: string }) => {
  const layerIds = useStorage((root) => root.layerIds);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None
  });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 255,
    g: 0,
    b: 0,
  });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const selections = useOthersMapped((other) => other.presence.selection);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  
  const clearCanvas = useMutation(({ storage }) => {
    const layers = storage.get("layers");
    if (layers) {
      for (const key of layers.keys()) {
        layers.delete(key);
      }
    }
    const layerIds = storage.get("layerIds");
    if (layerIds) {
      layerIds.clear();
    }
  }, []);

  const pointerEventToCanvasPoint = useCallback((e: React.PointerEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handlePointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e);
      setMyPresence({ cursor: current });

      if (canvasState.mode === CanvasMode.Pressing && canvasState.origin) {
        setCanvasState({
          mode: CanvasMode.SelectionNet,
          origin: canvasState.origin,
          current,
        });
      }
    },
    [pointerEventToCanvasPoint, canvasState]
  );

  const handlePointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

    const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e);

      if (canvasState.mode === CanvasMode.Inserting) return;

      if (canvasState.mode === CanvasMode.Pencil) {
        // handle pencil
        return;
      }

      setCanvasState({
        origin: point,
        mode: CanvasMode.Pressing,
      });
    },
    [ canvasState.mode, setCanvasState]
  );

 const insertLayer = useMutation(
  (
    { storage, setMyPresence },
    layerType: LayerType.Circle | LayerType.Rectangle,
    position: Point
  ) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");
    
    // Generate ID only on client side
    const layerId = nanoid();

    const layer = new LiveObject({
      type: layerType,
      x: position.x,
      y: position.y,
      width: 100,
      height: 100,
      fill: lastUsedColor,
    });

    // Push layerId first, then set layer
    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);

    setMyPresence({ selection: [layerId] }, { addToHistory: true });
    setCanvasState({
      mode: CanvasMode.None,
    });
  },
  [lastUsedColor]
);
const handlePointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        // unselectLayer();
        setCanvasState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        // insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layer, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }
      history.resume();
    },
    [
      canvasState,
      history,
      insertLayer,
      setCanvasState,
    ]
  );



  const handleLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();

      if (!self.presence.selection?.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
    },
    [history, canvasState.mode]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [history]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

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
          
          
        </g>
      </svg>
    </div>
  );
};