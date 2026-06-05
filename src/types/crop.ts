export interface CropArea {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropResult {
  id: number;
  blob: Blob;
  url: string;
}

export type CropNumericField = keyof CropArea;
