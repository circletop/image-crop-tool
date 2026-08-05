"use client";

import { useCallback, useState } from "react";
import type { CropArea } from "@/types/crop";
import {
  createCropArea,
  removeCropArea,
  updateCropArea,
} from "@/utils/cropAreas";
import { useCropHistory } from "@/hooks/useCropHistory";

interface UseCropAreasOptions {
  imageRef: React.RefObject<HTMLImageElement | null>;
}

export function useCropAreas({
  imageRef,
}: UseCropAreasOptions) {
  const [crops, setCrops] = useState<CropArea[]>([]);
  const [selectedCropId, setSelectedCropId] =
    useState<number | null>(null);
  const {
    canRedo,
    canUndo,
    recordChange,
    redo,
    resetHistory,
    undo,
  } = useCropHistory();

  const resetCrops = useCallback(() => {
    setCrops([]);
    setSelectedCropId(null);
    resetHistory();
  }, [resetHistory]);

  const addCrop = useCallback(() => {
    // 新裁剪框按当前图片显示尺寸创建，避免小图上默认框超出边界。
    const crop = createCropArea(crops.length, {
      canvasWidth: imageRef.current?.clientWidth,
      canvasHeight: imageRef.current?.clientHeight,
    });

    setCrops((prev) => recordChange(prev, [...prev, crop]));
    setSelectedCropId(crop.id);
  }, [crops.length, imageRef, recordChange]);

  const updateCrop = useCallback(
    (id: number, data: Partial<CropArea>) => {
      setCrops((prev) =>
        recordChange(prev, updateCropArea(prev, id, data))
      );
    },
    [recordChange]
  );

  const removeCrop = useCallback((id: number) => {
    setCrops((prev) =>
      recordChange(prev, removeCropArea(prev, id))
    );
    setSelectedCropId((prev) => (prev === id ? null : prev));
  }, [recordChange]);

  const removeSelectedCrop = useCallback(() => {
    if (!selectedCropId) return;

    removeCrop(selectedCropId);
  }, [removeCrop, selectedCropId]);

  const nudgeSelectedCrop = useCallback(
    (dx: number, dy: number) => {
      if (!selectedCropId) return;

      setCrops((prev) => {
        const next = prev.map((crop) => {
          if (crop.id !== selectedCropId) return crop;

          // 键盘微调会被限制在图片显示区域内。
          const maxX =
            imageRef.current?.clientWidth !== undefined
              ? Math.max(
                  0,
                  imageRef.current.clientWidth - crop.width
                )
              : crop.x + dx;
          const maxY =
            imageRef.current?.clientHeight !== undefined
              ? Math.max(
                  0,
                  imageRef.current.clientHeight - crop.height
                )
              : crop.y + dy;

          return {
            ...crop,
            x: Math.min(Math.max(crop.x + dx, 0), maxX),
            y: Math.min(Math.max(crop.y + dy, 0), maxY),
          };
        });

        return recordChange(prev, next);
      });
    },
    [imageRef, recordChange, selectedCropId]
  );

  const undoCropChange = useCallback(
    () =>
      undo(
        crops,
        selectedCropId,
        setCrops,
        setSelectedCropId
      ),
    [crops, selectedCropId, undo]
  );

  const redoCropChange = useCallback(
    () =>
      redo(
        crops,
        selectedCropId,
        setCrops,
        setSelectedCropId
      ),
    [crops, redo, selectedCropId]
  );

  return {
    canRedo,
    canUndo,
    crops,
    selectedCropId,
    addCrop,
    nudgeSelectedCrop,
    removeCrop,
    removeSelectedCrop,
    redoCropChange,
    resetCrops,
    setSelectedCropId,
    undoCropChange,
    updateCrop,
  };
}
