"use client";

import { useEffect, useRef } from "react";
import type { CropArea } from "@/types/crop";

interface LivePreviewPanelProps {
  crop: CropArea | null;
  imageRef: React.RefObject<HTMLImageElement | null>;
  imageLoadVersion: number;
}

export function LivePreviewPanel({
  crop,
  imageRef,
  imageLoadVersion,
}: LivePreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image || !crop) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // 预览和最终导出使用同一套坐标换算，保证缩放后看到的结果一致。
    const scaleX = image.naturalWidth / image.clientWidth;
    const scaleY = image.naturalHeight / image.clientHeight;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.clearRect(0, 0, crop.width, crop.height);
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [crop, imageLoadVersion, imageRef]);

  return (
    <div className="mb-6 border rounded-2xl p-4">
      <h3 className="font-bold mb-3">实时预览</h3>

      {crop ? (
        <div className="space-y-3">
          <div className="text-sm text-gray-500">
            {crop.name} · {crop.width} × {crop.height}
          </div>

          <div className="bg-gray-100 rounded-xl border overflow-hidden">
            <canvas
              ref={canvasRef}
              className="block w-full h-auto"
            />
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          请选择一个裁剪区域
        </div>
      )}
    </div>
  );
}
