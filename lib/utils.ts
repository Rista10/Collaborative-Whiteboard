import { Color } from "@/types/canvas";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g
    .toString(16)
    .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}
const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export const connectionIdToColor = (connectionId: number) => {
  return COLORS[connectionId % COLORS.length];
};