"use client";

import { useCallback, useState } from "react";
import type { CropArea } from "@/types/crop";

interface CropHistoryState {
  past: CropArea[][];
  future: CropArea[][];
}

function hasCropChanged(
  prev: CropArea[],
  next: CropArea[]
) {
  // 历史记录只关心裁剪框数据本身，未产生变化时不压入历史栈。
  return JSON.stringify(prev) !== JSON.stringify(next);
}

function getValidSelectedCropId(
  crops: CropArea[],
  selectedCropId: number | null
) {
  // 撤销/重做后如果原选中项已不存在，则自动回退到最后一个裁剪框。
  if (
    selectedCropId &&
    crops.some((crop) => crop.id === selectedCropId)
  ) {
    return selectedCropId;
  }

  return crops.at(-1)?.id ?? null;
}

export function useCropHistory() {
  const [history, setHistory] = useState<CropHistoryState>({
    past: [],
    future: [],
  });

  const recordChange = useCallback(
    (
      prev: CropArea[],
      next: CropArea[]
    ) => {
      if (!hasCropChanged(prev, next)) return next;

      // 产生新操作后清空 future，符合常见编辑器的撤销/重做规则。
      setHistory((current) => ({
        past: [...current.past, prev],
        future: [],
      }));

      return next;
    },
    []
  );

  const resetHistory = useCallback(() => {
    setHistory({
      past: [],
      future: [],
    });
  }, []);

  const undo = useCallback(
    (
      crops: CropArea[],
      selectedCropId: number | null,
      applyCrops: (next: CropArea[]) => void,
      applySelectedCropId: (next: number | null) => void
    ) => {
      const previous = history.past.at(-1);

      if (!previous) return;

      // 撤销时当前状态进入 future，上一帧恢复为当前裁剪框状态。
      setHistory((current) => ({
        past: current.past.slice(0, -1),
        future: [crops, ...current.future],
      }));
      applyCrops(previous);
      applySelectedCropId(
        getValidSelectedCropId(previous, selectedCropId)
      );
    },
    [history.past]
  );

  const redo = useCallback(
    (
      crops: CropArea[],
      selectedCropId: number | null,
      applyCrops: (next: CropArea[]) => void,
      applySelectedCropId: (next: number | null) => void
    ) => {
      const next = history.future[0];

      if (!next) return;

      // 重做时当前状态回到 past，future 的第一帧恢复为当前裁剪框状态。
      setHistory((current) => ({
        past: [...current.past, crops],
        future: current.future.slice(1),
      }));
      applyCrops(next);
      applySelectedCropId(
        getValidSelectedCropId(next, selectedCropId)
      );
    },
    [history.future]
  );

  return {
    canRedo: history.future.length > 0,
    canUndo: history.past.length > 0,
    recordChange,
    redo,
    resetHistory,
    undo,
  };
}
