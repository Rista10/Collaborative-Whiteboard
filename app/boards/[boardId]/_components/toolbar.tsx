import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";
import {
    Circle,
    Pencil,
    MousePointer2,
    Square,
    Undo2,
    Redo2,
    Trash2,
} from "lucide-react"
import { ToolButton } from "./toolbutton";

interface ToolBarProps {
    canvasState: CanvasState;
    setCanvasState: (state: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    clearCanvas: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const ToolBar = ({
    canvasState,
    setCanvasState,
    undo,
    redo,
    clearCanvas,
    canUndo,
    canRedo
}: ToolBarProps) => {
    return (
        <div className="absolute top-[40%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div className="bg-white rounded-md p-1.5 flex gap-1 flex-col items-center shadow-md">
                <ToolButton
                    label="Select"
                    icon={MousePointer2}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.None,
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.None ||
                        canvasState.mode === CanvasMode.SelectionNet ||
                        canvasState.mode === CanvasMode.Pressing ||
                        canvasState.mode === CanvasMode.Resizing
                    }
                />
                <ToolButton
                    label="Rectangle"
                    icon={Square}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layer: LayerType.Rectangle,
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting && canvasState.layer === LayerType.Rectangle
                    }
                />
                <ToolButton
                    label="Circle"
                    icon={Circle}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layer: LayerType.Circle,
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting && canvasState.layer === LayerType.Circle
                    }
                />
                <ToolButton
                    label="Pencil"
                    icon={Pencil}
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Pencil,
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Pencil
                    }
                />
                <ToolButton
                    label="Undo"
                    icon={Undo2}
                    onClick={undo}
                    isActive={canUndo}
                />
                <ToolButton
                    label="Redo"
                    icon={Redo2}
                    onClick={redo}
                    isActive={canRedo}
                />
                <ToolButton
                    label="Clear"
                    icon={Trash2}
                    onClick={clearCanvas}
                />

            </div>
        </div>
    );
}