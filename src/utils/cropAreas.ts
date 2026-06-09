import type { CropArea } from "@/types/crop";

const DEFAULT_CROP_SIZE = 300;
const DEFAULT_CROP_POSITION = 100;

export function createCropArea(index: number): CropArea {
  return {
    id: Date.now(),
    name: `裁剪区域 ${index + 1}`,
    x: DEFAULT_CROP_POSITION,
    y: DEFAULT_CROP_POSITION,
    width: DEFAULT_CROP_SIZE,
    height: DEFAULT_CROP_SIZE,
    aspectRatio: null,
  };
}

export function addCropArea(crops: CropArea[]): CropArea[] {
  return [...crops, createCropArea(crops.length)];
}

export function updateCropArea(
  crops: CropArea[],
  id: number,
  data: Partial<CropArea>
): CropArea[] {
  return crops.map((crop) =>
    crop.id === id
      ? {
          ...crop,
          ...data,
        }
      : crop
  );
}

export function removeCropArea(
  crops: CropArea[],
  id: number
): CropArea[] {
  return crops.filter((crop) => crop.id !== id);
}
