import type { AlignmentGuide } from "@/types/alignment";

// 吸附阈值：目标线距离裁剪框边缘或中心不超过该距离时触发吸附。
const SNAP_DISTANCE = 6;

export interface SnapCandidate {
  offset: number;
  distance: number;
  guide: AlignmentGuide;
}

export function findNearestSnap(
  points: number[],
  targets: number[],
  orientation: AlignmentGuide["orientation"]
): SnapCandidate | null {
  let nearest: SnapCandidate | null = null;

  // 从所有候选点中找最近的参考线，返回实际需要应用到裁剪框的偏移量。
  for (const point of points) {
    for (const target of targets) {
      const offset = target - point;
      const distance = Math.abs(offset);

      if (
        distance <= SNAP_DISTANCE &&
        (!nearest || distance < nearest.distance)
      ) {
        nearest = {
          offset,
          distance,
          guide: {
            orientation,
            position: target,
          },
        };
      }
    }
  }

  return nearest;
}

export function getSnapGuides(
  verticalSnap: SnapCandidate | null,
  horizontalSnap: SnapCandidate | null
) {
  const guides: AlignmentGuide[] = [];

  if (verticalSnap) guides.push(verticalSnap.guide);
  if (horizontalSnap) guides.push(horizontalSnap.guide);

  return guides;
}
