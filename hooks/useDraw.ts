import { useEffect, useRef, useState } from "react";

interface Draw {
  ctx: CanvasRenderingContext2D;
  currentPoint: { x: number; y: number };
  prevPoint?: { x: number; y: number } | null;
}

export const useDraw = (onDraw:({ctx,currentPoint,prevPoint}:Draw)=>void) => {
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevPoint = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown=()=>{
    setMouseDown(true);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handler = (e: MouseEvent) => {
      const currentPoints = computePointInCanvas(e)
      if (!mouseDown) 
        return;

      const ctx = canvas.getContext("2d")

      if(!ctx || !currentPoints) return;

      onDraw({ctx, currentPoint: currentPoints, prevPoint: prevPoint.current});
      prevPoint.current = currentPoints
    };

    const mouseUpHandler = ()=>{
      setMouseDown(false);
      prevPoint.current = null; 
    }

    const computePointInCanvas =(e:MouseEvent)=>{
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return {x,y}
    }

    canvas.addEventListener("mousemove", handler);
    window.addEventListener('mouseup',mouseUpHandler)

    return () => {
      canvas.removeEventListener("mousemove", handler);
      window.removeEventListener('mouseup',mouseUpHandler)
    };
  }, [onDraw]);

  return { canvasRef,onMouseDown };
};
