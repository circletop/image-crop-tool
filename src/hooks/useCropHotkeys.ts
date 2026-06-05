"use client";

import { useEffect } from "react";

interface UseCropHotkeysOptions {
  selectedCropId: number | null;
  onDeleteSelected: () => void;
  onResetZoom: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
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

export function useCropHotkeys({
  selectedCropId,
  onDeleteSelected,
  onResetZoom,
  onZoomIn,
  onZoomOut,
}: UseCropHotkeysOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedCropId
      ) {
        onDeleteSelected();
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

    return () => {
      window.removeEventListener("keydown", handleKeyDown, {
        capture: true,
      });
    };
  }, [
    onDeleteSelected,
    onResetZoom,
    onZoomIn,
    onZoomOut,
    selectedCropId,
  ]);
}
