"use client";

import { useDraw } from "@/hooks/useDraw";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { ChromePicker } from "react-color";

interface Draw {
  ctx: CanvasRenderingContext2D;
  currentPoint: { x: number; y: number };
  prevPoint?: { x: number; y: number } | null;
}

export default function Home() {
  const {canvasRef,onMouseDown} = useDraw(drawLine);
  const [color, setColor] = React.useState<string>("#FFFFFF");

  function drawLine({prevPoint, currentPoint, ctx}:Draw) {
    const { x: currX, y: currY} = currentPoint;
    // const lineColor = '#FFFFFF'
    const lineWidth = 5;

    let startPoint = prevPoint ?? { x: currX, y: currY };
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.moveTo(startPoint.x,startPoint.y)
    ctx.lineTo(currX, currY)
    ctx.stroke()

    ctx.fillStyle = color;
    ctx.beginPath()
    ctx.arc(startPoint.x,startPoint.y,2,0,2 * Math.PI)
    ctx.fill()
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
    <div className="flex gap-x-4">
        <p>This is a screen for authenticated users</p>
       <UserButton/>
    </div>
    <div className="flex gap-x-5">
      <canvas onMouseDown={onMouseDown} ref={canvasRef} width={750} height={750} className="border z-10"/>
      <ChromePicker color={color} onChange={(e)=>setColor(e.hex)}/>
    </div>
    </div>
  );
}
