"use client"
import { colorToCss } from "@/lib/utils";
import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react/suspense";


interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor: string;
        }

export const LayerPreview = ({
    id,
    onLayerPointerDown,
    selectionColor
}: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));
    if (!layer) return null;
    const { x, y, width, height, fill } = layer;

    switch (layer.type) {
        case LayerType.Circle:
            return (
                <circle
                    cx={x + width / 2}
                    cy={y + height / 2}
                    r={Math.min(width, height) / 2}
                    fill={fill ? colorToCss(fill) : "#000"}
                    stroke={selectionColor || "transparent"}
                    onPointerDown={(e) => onLayerPointerDown(e, id)}
                    strokeWidth={1}
                />
            )


        case LayerType.Rectangle:
            return (
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill ? colorToCss(fill) : "#000"}
                    stroke={selectionColor || "transparent"}
                    onPointerDown={(e) => onLayerPointerDown(e, id)}
                    strokeWidth={1}
                />
            )
        case LayerType.Path:
    return (
        <path
            onPointerDown={(e) => onLayerPointerDown(e, id)}
            d={layer.points ? layer.points.map((point, index) =>
                index === 0 ? `M ${point[0]} ${point[1]}` : `L ${point[0]} ${point[1]}`
            ).join(' ') : ""}
            fill="none"
            stroke={fill ? colorToCss(fill) : "#000"}
            strokeWidth={2}
            style={{
                transform: `translate(${layer.x}px, ${layer.y}px)`,
            }}
        />
    );
}
}
