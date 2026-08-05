"use client";

import { useEffect } from "react";

interface UseCropHotkeysOptions {
  selectedCropId: number | null;
  onDeleteSelected: () => void;
  onNudgeSelected: (dx: number, dy: number) => void;
  onRedo: () => void;
  onResetZoom: () => void;
  onUndo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

function isTextEditingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  // 只在真实文本/数字编辑控件中跳过快捷键，文件上传框和按钮不屏蔽微调。
  const editable = target.closest(
    "textarea, select, [contenteditable='true']"
  );

  if (editable) return true;

  const input = target.closest("input");

  if (!(input instanceof HTMLInputElement)) return false;

  return [
    "date",
    "datetime-local",
    "email",
    "month",
    "number",
    "password",
    "search",
    "tel",
    "text",
    "time",
    "url",
    "week",
  ].includes(input.type);
}

function isAppZoomHotkey(e: KeyboardEvent) {
  if (!e.ctrlKey && !e.metaKey) return false;

  return (
    e.key === "0" ||
    e.key === "=" ||
    e.key === "+" ||
    e.key === "-"
  );
}

function isUndoHotkey(e: KeyboardEvent) {
  return (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z";
}

export function useCropHotkeys({
  selectedCropId,
  onDeleteSelected,
  onNudgeSelected,
  onRedo,
  onResetZoom,
  onUndo,
  onZoomIn,
  onZoomOut,
}: UseCropHotkeysOptions) {
  useEffect(() => {
    // 同时监听 window 和 document，WeakSet 用于避免同一个键盘事件被处理两次。
    const handledEvents = new WeakSet<KeyboardEvent>();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (handledEvents.has(e)) return;
      handledEvents.add(e);

      if (isTextEditingTarget(e.target)) return;

      if (isUndoHotkey(e)) {
        e.preventDefault();
        e.stopPropagation();

        if (e.shiftKey) {
          onRedo();
          return;
        }

        onUndo();
        return;
      }

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedCropId
      ) {
        onDeleteSelected();
        return;
      }

      if (selectedCropId && e.key.startsWith("Arrow")) {
        const step = e.shiftKey ? 10 : 1;

        e.preventDefault();
        e.stopPropagation();

        if (e.key === "ArrowUp") onNudgeSelected(0, -step);
        if (e.key === "ArrowDown") onNudgeSelected(0, step);
        if (e.key === "ArrowLeft") onNudgeSelected(-step, 0);
        if (e.key === "ArrowRight") onNudgeSelected(step, 0);

        return;
      }

      if (!isAppZoomHotkey(e)) return;

      e.preventDefault();
      e.stopPropagation();

      if (e.key === "0") {
        onResetZoom();
        return;
      }

      if (e.key === "=" || e.key === "+") {
        onZoomIn();
        return;
      }

      if (e.key === "-") {
        onZoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown, {
      capture: true,
    });
    document.addEventListener("keydown", handleKeyDown, {
      capture: true,
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, {
        capture: true,
      });
      document.removeEventListener("keydown", handleKeyDown, {
        capture: true,
      });
    };
  }, [
    onDeleteSelected,
    onNudgeSelected,
    onRedo,
    onResetZoom,
    onUndo,
    onZoomIn,
    onZoomOut,
    selectedCropId,
  ]);
}
