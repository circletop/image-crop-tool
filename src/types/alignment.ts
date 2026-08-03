export interface CanvasSize {
  width: number;
  height: number;
}

export interface AlignmentGuide {
  orientation: "vertical" | "horizontal";
  position: number;
}

export interface SnapResult {
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  guides: AlignmentGuide[];
}

export interface CropBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
