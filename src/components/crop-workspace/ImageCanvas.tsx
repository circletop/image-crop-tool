"use client";

import { useState } from "react";
import { AlignmentGuides } from "@/components/crop-workspace/AlignmentGuides";
import { CropBoxLayer } from "@/components/crop-workspace/CropBoxLayer";
import { useAlignmentGuides } from "@/hooks/useAlignmentGuides";
import type { ElementSize } from "@/types/canvas";
import type { CropArea } from "@/types/crop";

interface ImageCanvasProps {
  image: string | null;
  crops: CropArea[];
  selectedCropId: number | null;
  scale: number;
  isPanning: boolean;
  spacePressed: boolean;
  imageRef: React.RefObject<HTMLImageElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onImageLoad: () => void;
  onSelectCrop: (id: number) => void;
  onUpdateCrop: (
    id: number,
    data: Partial<CropArea>
  ) => void;
  onZoomAtPoint: (
    clientX: number,
    clientY: number,
    deltaY: number
  ) => void;
  onStartPan: (clientX: number, clientY: number) => void;
  onMovePan: (clientX: number, clientY: number) => void;
  onStopPan: () => void;
}

export function ImageCanvas({
  image,
  crops,
  selectedCropId,
  scale,
  isPanning,
  spacePressed,
  imageRef,
  scrollRef,
  canvasRef,
  onImageLoad,
  onSelectCrop,
  onUpdateCrop,
  onZoomAtPoint,
  onStartPan,
  onMovePan,
  onStopPan,
}: ImageCanvasProps) {
  const [imageBounds, setImageBounds] = useState<ElementSize>({
    width: 0,
    height: 0,
  });

  const getCanvasSize = () => ({
    width: imageRef.current?.clientWidth ?? 0,
    height: imageRef.current?.clientHeight ?? 0,
  });

  const {
    guides,
    clearGuides,
    commitMovingCrop,
    commitResizedCrop,
    previewMovingGuides,
    previewResizedGuides,
  } = useAlignmentGuides({
    crops,
    getCanvasSize,
    onUpdateCrop,
  });

  const handleImageLoaded = (
    e: React.SyntheticEvent<HTMLImageElement>
  ) => {
    setImageBounds({
      width: e.currentTarget.clientWidth,
      height: e.currentTarget.clientHeight,
    });
    onImageLoad();
  };

  return (
    <div className="flex-1 min-h-0 mt-2 overflow-hidden">
      <div
        ref={scrollRef}
        onWheel={(e) => {
          if (!e.ctrlKey) return;

          e.preventDefault();
          onZoomAtPoint(e.clientX, e.clientY, e.deltaY);
        }}
        onMouseDown={(e) => {
          onStartPan(e.clientX, e.clientY);
        }}
        onMouseMove={(e) => {
          onMovePan(e.clientX, e.clientY);
        }}
        onMouseUp={onStopPan}
        onMouseLeave={onStopPan}
        style={{
          touchAction: "none",
        }}
        className={[
          "w-full h-full overflow-auto rounded-2xl border bg-[#f5f5f5]",
          spacePressed ? "cursor-grab" : "",
          isPanning ? "cursor-grabbing" : "",
        ].join(" ")}
      >
        <div
          ref={canvasRef}
          className="relative inline-block"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {image && (
            <>
              <img
                ref={imageRef}
                src={image}
                alt=""
                draggable={false}
                onLoad={handleImageLoaded}
                className="max-w-none select-none touch-none"
              />

              <CropBoxLayer
                crops={crops}
                selectedCropId={selectedCropId}
                scale={scale}
                onSelectCrop={onSelectCrop}
                onMove={previewMovingGuides}
                onMoveEnd={(crop, x, y) => {
                  commitMovingCrop(crop, x, y);
                  clearGuides();
                }}
                onResize={previewResizedGuides}
                onResizeEnd={(crop, direction, ref, position) => {
                  commitResizedCrop(
                    crop,
                    direction,
                    ref,
                    position
                  );
                  clearGuides();
                }}
              />

              {/* ImageCanvas 只组合图层；参考线和吸附细节由 useAlignmentGuides 管理。 */}
              <AlignmentGuides
                guides={guides}
                bounds={imageBounds}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
