export type Color = {
    r: number;
    g: number;
    b: number;
}

export enum LayerType {
    Rectangle,
    Circle,
    Path,
    // Text
}

export type RectangleLayer = {
    type: LayerType.Rectangle;
    fill: Color;
    width: number;
    height: number;
    x: number;
    y: number;
}

export type CircleLayer = {
    type: LayerType.Circle;
    fill: Color;
    height: number;
    width: number;
    x: number;
    y: number;
}

export type PathLayer = {
    type: LayerType.Path;
    fill: Color;
    x: number;
    y: number;
    height: number;
    width: number;
    points: number[][];
}

export type Point ={
    x: number;
    y: number;
}

export type XYWH = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export enum CanvasMode {
    None, 
    Pressing,
    SelectionNet,
    Inserting,
    Pencil
}

export type CanvasState =
    | { 
        mode: CanvasMode.None 
    }
    | { 
        mode: CanvasMode.Pressing;
        origin: Point;
     }
    | { 
        mode: CanvasMode.SelectionNet;
        origin: Point;
        current?: Point;
    }
    | { 
        mode: CanvasMode.Inserting;
        layer:LayerType.Circle | LayerType.Rectangle 
    }
    | { mode: CanvasMode.Pencil };

export type Layer = RectangleLayer | CircleLayer | PathLayer;