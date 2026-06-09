"use client";

import { Rnd } from "react-rnd";
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
        className={`
          w-full
          h-full
          overflow-auto
          rounded-2xl
          border
          bg-[#f5f5f5]
          ${spacePressed ? "cursor-grab" : ""}
          ${isPanning ? "cursor-grabbing" : ""}
        `}
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
                onLoad={onImageLoad}
                className="
                  max-w-none
                  select-none
                  touch-none
                "
              />

              {crops.map((crop, index) => (
                <Rnd
                  key={crop.id}
                  onMouseDown={() => {
                    onSelectCrop(crop.id);
                  }}
                  size={{
                    width: crop.width,
                    height: crop.height,
                  }}
                  position={{
                    x: crop.x,
                    y: crop.y,
                  }}
                  bounds="parent"
                  scale={scale}
                  lockAspectRatio={
                    crop.aspectRatio ?? false
                  }
                  onDragStop={(e, d) => {
                    onUpdateCrop(crop.id, {
                      x: d.x,
                      y: d.y,
                    });
                  }}
                  onDrag={(e, d) => {
                    onUpdateCrop(crop.id, {
                      x: d.x,
                      y: d.y,
                    });
                  }}
                  onResize={(
                    e,
                    direction,
                    ref,
                    delta,
                    position
                  ) => {
                    onUpdateCrop(crop.id, {
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      x: position.x,
                      y: position.y,
                    });
                  }}
                  onResizeStop={(
                    e,
                    direction,
                    ref,
                    delta,
                    position
                  ) => {
                    onUpdateCrop(crop.id, {
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      x: position.x,
                      y: position.y,
                    });
                  }}
                  className={`
                    border-2
                    ${
                      selectedCropId === crop.id
                        ? "border-green-500 bg-green-500/10"
                        : "border-blue-500 bg-blue-500/10"
                    }
                  `}
                >
                  <div className="w-full h-full relative">
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1">
                      {crop.name || `#${index + 1}`}
                    </div>
                  </div>
                </Rnd>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
