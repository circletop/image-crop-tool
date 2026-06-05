export const MIN_SCALE = 0.2;
export const MAX_SCALE = 5;
export const ZOOM_STEP = 0.1;
export const ZOOM_IN_FACTOR = 1.1;
export const ZOOM_OUT_FACTOR = 0.9;

export function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export function zoomIn(scale: number) {
  return clampScale(scale + ZOOM_STEP);
}

export function zoomOut(scale: number) {
  return clampScale(scale - ZOOM_STEP);
}

export function zoomByFactor(
  scale: number,
  factor: number
) {
  return clampScale(scale * factor);
}
