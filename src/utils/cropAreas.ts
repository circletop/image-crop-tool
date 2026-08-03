import type { CropArea } from "@/types/crop";

const DEFAULT_CROP_SIZE = 300;
const DEFAULT_CROP_POSITION = 100;

interface CreateCropAreaOptions {
  canvasWidth?: number;
  canvasHeight?: number;
}

export function createCropArea(
  index: number,
  options: CreateCropAreaOptions = {}
): CropArea {
  // 默认尺寸不能超过当前图片显示尺寸，否则小图会一创建就越界。
  const width = Math.max(
    1,
    Math.min(DEFAULT_CROP_SIZE, options.canvasWidth ?? DEFAULT_CROP_SIZE)
  );
  const height = Math.max(
    1,
    Math.min(DEFAULT_CROP_SIZE, options.canvasHeight ?? DEFAULT_CROP_SIZE)
  );
  // 默认位置优先放在 100px 附近，空间不足时贴近可显示边界。
  const x = Math.min(
    DEFAULT_CROP_POSITION,
    Math.max(0, (options.canvasWidth ?? width) - width)
  );
  const y = Math.min(
    DEFAULT_CROP_POSITION,
    Math.max(0, (options.canvasHeight ?? height) - height)
  );

  return {
    id: Date.now(),
    name: `裁剪区域 ${index + 1}`,
    x,
    y,
    width,
    height,
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
