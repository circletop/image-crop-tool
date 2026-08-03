"use client";

import { useState } from "react";
import type { AlignmentGuide } from "@/types/alignment";
import type { ElementPosition, ElementSize } from "@/types/canvas";
import type { CropArea } from "@/types/crop";
import {
  getMovedCropGuides,
  getResizedCropGuides,
  snapMovedCrop,
  snapResizedCrop,
} from "@/utils/alignment";

interface UseAlignmentGuidesOptions {
  crops: CropArea[];
  getCanvasSize: () => ElementSize;
  onUpdateCrop: (
    id: number,
    data: Partial<CropArea>
  ) => void;
}

function getResizeBounds(
  ref: HTMLElement,
  position: ElementPosition
) {
  return {
    width: parseInt(ref.style.width),
    height: parseInt(ref.style.height),
    x: position.x,
    y: position.y,
  };
}

export function useAlignmentGuides({
  crops,
  getCanvasSize,
  onUpdateCrop,
}: UseAlignmentGuidesOptions) {
  const [guides, setGuides] = useState<AlignmentGuide[]>([]);

  const previewMovingGuides = (
    crop: CropArea,
    x: number,
    y: number
  ) => {
    const canvasSize = getCanvasSize();

    if (!canvasSize.width || !canvasSize.height) return;

    // 拖动过程中只显示参考线，不写入位置，避免和 react-rnd 的内部拖拽状态冲突。
    setGuides(
      getMovedCropGuides(
        {
          x,
          y,
          width: crop.width,
          height: crop.height,
        },
        crops,
        canvasSize,
        crop.id
      )
    );
  };

  const commitMovingCrop = (
    crop: CropArea,
    x: number,
    y: number
  ) => {
    const canvasSize = getCanvasSize();

    if (!canvasSize.width || !canvasSize.height) {
      onUpdateCrop(crop.id, {
        x,
        y,
      });
      return;
    }

    // 松手时才把吸附后的最终坐标写回裁剪框状态。
    const snap = snapMovedCrop(
      {
        x,
        y,
        width: crop.width,
        height: crop.height,
      },
      crops,
      canvasSize,
      crop.id
    );

    onUpdateCrop(crop.id, snap.crop);
  };

  const previewResizedGuides = (
    crop: CropArea,
    direction: string,
    ref: HTMLElement,
    position: ElementPosition
  ) => {
    const bounds = getResizeBounds(ref, position);
    const canvasSize = getCanvasSize();

    if (!canvasSize.width || !canvasSize.height) return;

    setGuides(
      getResizedCropGuides(
        bounds,
        crops,
        canvasSize,
        crop.id,
        direction
      )
    );
  };

  const commitResizedCrop = (
    crop: CropArea,
    direction: string,
    ref: HTMLElement,
    position: ElementPosition
  ) => {
    const bounds = getResizeBounds(ref, position);
    const canvasSize = getCanvasSize();

    if (!canvasSize.width || !canvasSize.height) {
      onUpdateCrop(crop.id, bounds);
      return;
    }

    const snap = snapResizedCrop(
      bounds,
      crops,
      canvasSize,
      crop.id,
      direction
    );

    onUpdateCrop(crop.id, snap.crop);
  };

  const clearGuides = () => {
    setGuides([]);
  };

  return {
    guides,
    clearGuides,
    commitMovingCrop,
    commitResizedCrop,
    previewMovingGuides,
    previewResizedGuides,
  };
}
