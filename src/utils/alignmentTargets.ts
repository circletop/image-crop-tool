import type { CanvasSize } from "@/types/alignment";
import type { CropArea } from "@/types/crop";

export interface AlignmentTargets {
  vertical: number[];
  horizontal: number[];
}

function getOtherCrops(
  crops: CropArea[],
  activeCropId: number
) {
  return crops.filter((crop) => crop.id !== activeCropId);
}

function getVerticalTargets(
  canvasSize: CanvasSize,
  crops: CropArea[]
): number[] {
  return [
    0,
    canvasSize.width / 2,
    canvasSize.width,
    ...crops.flatMap((crop) => [
      crop.x,
      crop.x + crop.width / 2,
      crop.x + crop.width,
    ]),
  ];
}

function getHorizontalTargets(
  canvasSize: CanvasSize,
  crops: CropArea[]
): number[] {
  return [
    0,
    canvasSize.height / 2,
    canvasSize.height,
    ...crops.flatMap((crop) => [
      crop.y,
      crop.y + crop.height / 2,
      crop.y + crop.height,
    ]),
  ];
}

export function getAlignmentTargets(
  canvasSize: CanvasSize,
  crops: CropArea[],
  activeCropId: number
): AlignmentTargets {
  const otherCrops = getOtherCrops(crops, activeCropId);

  // 对齐目标包含图片自身的边缘/中心，以及其他裁剪框的边缘/中心。
  return {
    vertical: getVerticalTargets(canvasSize, otherCrops),
    horizontal: getHorizontalTargets(canvasSize, otherCrops),
  };
}
