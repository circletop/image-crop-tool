"use client";

import { useCallback, useRef, useState } from "react";
import type { CropResult } from "@/types/crop";
import { cropImageByAreas } from "@/utils/cropImage";
import {
  downloadCropResult,
  downloadCropResultsZip,
} from "@/utils/download";
import { useCropAreas } from "@/hooks/useCropAreas";
import { useCanvasPan } from "@/hooks/useCanvasPan";
import { useCanvasZoom } from "@/hooks/useCanvasZoom";
import { useCropHotkeys } from "@/hooks/useCropHotkeys";

export function useCropWorkspace() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const [results, setResults] = useState<CropResult[]>([]);
  const [imageLoadVersion, setImageLoadVersion] =
    useState(0);

  const {
    crops,
    selectedCropId,
    addCrop,
    nudgeSelectedCrop,
    removeCrop,
    removeSelectedCrop,
    resetCrops,
    setSelectedCropId,
    updateCrop,
  } = useCropAreas({
    imageRef,
  });

  const {
    scale,
    resetZoom,
    increaseZoom,
    decreaseZoom,
    zoomAtPoint,
  } = useCanvasZoom(scrollRef);

  const {
    isPanning,
    spacePressed,
    startPan,
    movePan,
    stopPan,
  } = useCanvasPan(scrollRef);

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setImage(url);
    resetCrops();
    setResults([]);
  };

  const handleImageLoad = useCallback(() => {
    setImageLoadVersion((prev) => prev + 1);
  }, []);

  const handleCrop = async () => {
    if (!imageRef.current) return;

    const newResults = await cropImageByAreas(
      imageRef.current,
      crops
    );

    setResults(newResults);
  };

  const downloadSingle = (
    item: CropResult,
    index: number
  ) => {
    downloadCropResult(item, index);
  };

  const downloadAll = async () => {
    await downloadCropResultsZip(results);
  };

  useCropHotkeys({
    selectedCropId,
    onDeleteSelected: removeSelectedCrop,
    onNudgeSelected: nudgeSelectedCrop,
    onResetZoom: resetZoom,
    onZoomIn: increaseZoom,
    onZoomOut: decreaseZoom,
  });

  return {
    imageRef,
    scrollRef,
    canvasRef,
    image,
    crops,
    selectedCropId,
    results,
    imageLoadVersion,
    scale,
    isPanning,
    spacePressed,
    setSelectedCropId,
    handleUpload,
    handleImageLoad,
    addCrop,
    updateCrop,
    removeCrop,
    handleCrop,
    downloadSingle,
    downloadAll,
    increaseZoom,
    decreaseZoom,
    zoomAtPoint,
    startPan,
    movePan,
    stopPan,
  };
}
