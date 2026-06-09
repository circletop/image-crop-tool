export interface CropArea {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number | null;
}

export interface CropResult {
  id: number;
  name: string;
  blob: Blob;
  url: string;
}

export type CropNumericField =
  | "width"
  | "height"
  | "x"
  | "y";
