import { getSvgPathFromStroke } from "@/utils/utils";
import getStroke from "perfect-freehand";

type Props ={
    x:number;
    y:number;
    points: number[][];
    fill: string;
    onPointerDown?: (e: React.PointerEvent) => void;
    stroke?: string;
}

export default function Pencil({ x, y, points, fill, onPointerDown, stroke = "black" }: Props) {
    return(
        <path
            onPointerDown={onPointerDown}
            d={getSvgPathFromStroke(
                getStroke(points, { size: 10, thinning: 0.5, smoothing: 0.5, streamline: 0.5 })
            )}
            style={{
                transform: `translate(${x}px, ${y}px)`,
            }}
            fill={fill}
            x={0}
            y={0}
            stroke={stroke}
            strokeWidth={2}
        />
    )
}