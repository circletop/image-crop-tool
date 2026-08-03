import type {
  AlignmentGuide,
  CropBounds,
  CanvasSize,
  SnapResult,
} from "@/types/alignment";
import type { CropArea } from "@/types/crop";
import { getAlignmentTargets } from "@/utils/alignmentTargets";
import { findNearestSnap, getSnapGuides } from "@/utils/snap";

function getMoveSnaps(
  crop: CropBounds,
  crops: CropArea[],
  canvasSize: CanvasSize,
  activeCropId: number
) {
  const targets = getAlignmentTargets(
    canvasSize,
    crops,
    activeCropId
  );
  // 移动时用裁剪框的左/中/右与上/中/下参与吸附判断。
  const verticalSnap = findNearestSnap(
    [crop.x, crop.x + crop.width / 2, crop.x + crop.width],
    targets.vertical,
    "vertical"
  );
  const horizontalSnap = findNearestSnap(
    [
      crop.y,
      crop.y + crop.height / 2,
      crop.y + crop.height,
    ],
    targets.horizontal,
    "horizontal"
  );

  return {
    verticalSnap,
    horizontalSnap,
  };
}

export function getMovedCropGuides(
  crop: CropBounds,
  crops: CropArea[],
  canvasSize: CanvasSize,
  activeCropId: number
) {
  const { verticalSnap, horizontalSnap } = getMoveSnaps(
    crop,
    crops,
    canvasSize,
    activeCropId
  );

  return getSnapGuides(verticalSnap, horizontalSnap);
}

export function snapMovedCrop(
  crop: CropBounds,
  crops: CropArea[],
  canvasSize: CanvasSize,
  activeCropId: number
): SnapResult {
  const { verticalSnap, horizontalSnap } = getMoveSnaps(
    crop,
    crops,
    canvasSize,
    activeCropId
  );

  return {
    crop: {
      x: crop.x + (verticalSnap?.offset ?? 0),
      y: crop.y + (horizontalSnap?.offset ?? 0),
      width: crop.width,
      height: crop.height,
    },
    guides: getSnapGuides(verticalSnap, horizontalSnap),
  };
}

export function getResizedCropGuides(
  crop: CropBounds,
  crops: CropArea[],
  canvasSize: CanvasSize,
  activeCropId: number,
  direction: string
) {
  const result = snapResizedCrop(
    crop,
    crops,
    canvasSize,
    activeCropId,
    direction
  );

  return result.guides;
}

export function snapResizedCrop(
  crop: CropBounds,
  crops: CropArea[],
  canvasSize: CanvasSize,
  activeCropId: number,
  direction: string
): SnapResult {
  const targets = getAlignmentTargets(
    canvasSize,
    crops,
    activeCropId
  );
  const nextCrop = {
    x: crop.x,
    y: crop.y,
    width: crop.width,
    height: crop.height,
  };
  const guides: AlignmentGuide[] = [];

  // 缩放时只调整正在拖动的边，避免吸附时把对侧边也带偏。
  if (direction.includes("left")) {
    const snap = findNearestSnap(
      [crop.x],
      targets.vertical,
      "vertical"
    );

    if (snap) {
      nextCrop.x += snap.offset;
      nextCrop.width -= snap.offset;
      guides.push(snap.guide);
    }
  }

  if (direction.includes("right")) {
    const snap = findNearestSnap(
      [crop.x + crop.width],
      targets.vertical,
      "vertical"
    );

    if (snap) {
      nextCrop.width += snap.offset;
      guides.push(snap.guide);
    }
  }

  if (direction.includes("top")) {
    const snap = findNearestSnap(
      [crop.y],
      targets.horizontal,
      "horizontal"
    );

    if (snap) {
      nextCrop.y += snap.offset;
      nextCrop.height -= snap.offset;
      guides.push(snap.guide);
    }
  }

  if (direction.includes("bottom")) {
    const snap = findNearestSnap(
      [crop.y + crop.height],
      targets.horizontal,
      "horizontal"
    );

    if (snap) {
      nextCrop.height += snap.offset;
      guides.push(snap.guide);
    }
  }

  return {
    crop: {
      ...nextCrop,
      width: Math.max(1, nextCrop.width),
      height: Math.max(1, nextCrop.height),
    },
    guides,
  };
}
