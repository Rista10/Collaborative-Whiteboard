import { SketchPicker, ColorResult } from "react-color";
import { Color } from "@/types/canvas"; // Use your custom Color type

interface ColorPickerProps {
  color: Color;
  onChange: (color: Color) => void;
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  return (
    <div className="absolute top-2/12 right-2 z-10">
        <p className="text-gray-500 p-2 pl-1">Pick a color to draw:</p>
      <SketchPicker
        color={color} 
        onChange={(colorResult: ColorResult) => {
          if (colorResult.rgb) {
            onChange({
              r: colorResult.rgb.r,
              g: colorResult.rgb.g,
              b: colorResult.rgb.b,
            });
          }
        }}
      />
    </div>
  );
};