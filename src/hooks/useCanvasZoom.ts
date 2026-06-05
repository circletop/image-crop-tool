"use client";

import { useCallback, useState } from "react";
import {
  clampScale,
  zoomByFactor,
  zoomIn,
  zoomOut,
  ZOOM_IN_FACTOR,
  ZOOM_OUT_FACTOR,
} from "@/utils/zoom";

export function useCanvasZoom(
  scrollRef: React.RefObject<HTMLDivElement | null>
) {
  const [scale, setScale] = useState(1);

  const resetZoom = useCallback(() => {
    setScale(1);
  }, []);

  const increaseZoom = useCallback(() => {
    setScale((prev) => zoomIn(prev));
  }, []);

  const decreaseZoom = useCallback(() => {
    setScale((prev) => zoomOut(prev));
  }, []);

  const zoomAtPoint = useCallback(
    (
      clientX: number,
      clientY: number,
      deltaY: number
    ) => {
      const container = scrollRef.current;

      if (!container) return;

      const rect = container.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;
      const worldX =
        (container.scrollLeft + offsetX) / scale;
      const worldY =
        (container.scrollTop + offsetY) / scale;
      const factor =
        deltaY > 0 ? ZOOM_OUT_FACTOR : ZOOM_IN_FACTOR;
      const nextScale = clampScale(
        zoomByFactor(scale, factor)
      );

      if (nextScale === scale) return;

      setScale(nextScale);

      requestAnimationFrame(() => {
        container.scrollLeft =
          worldX * nextScale - offsetX;
        container.scrollTop =
          worldY * nextScale - offsetY;
      });
    },
    [scale, scrollRef]
  );

  return {
    scale,
    resetZoom,
    increaseZoom,
    decreaseZoom,
    zoomAtPoint,
  };
}
