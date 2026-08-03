"use client";

import { Rnd } from "react-rnd";
import type { ElementPosition } from "@/types/canvas";
import type { CropArea } from "@/types/crop";

interface CropBoxLayerProps {
  crops: CropArea[];
  selectedCropId: number | null;
  scale: number;
  onSelectCrop: (id: number) => void;
  onMove: (crop: CropArea, x: number, y: number) => void;
  onMoveEnd: (crop: CropArea, x: number, y: number) => void;
  onResize: (
    crop: CropArea,
    direction: string,
    ref: HTMLElement,
    position: ElementPosition
  ) => void;
  onResizeEnd: (
    crop: CropArea,
    direction: string,
    ref: HTMLElement,
    position: ElementPosition
  ) => void;
}

export function CropBoxLayer({
  crops,
  selectedCropId,
  scale,
  onSelectCrop,
  onMove,
  onMoveEnd,
  onResize,
  onResizeEnd,
}: CropBoxLayerProps) {
  return (
    <>
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
          lockAspectRatio={crop.aspectRatio ?? false}
          onDrag={(e, d) => {
            onMove(crop, d.x, d.y);
          }}
          onDragStop={(e, d) => {
            onMoveEnd(crop, d.x, d.y);
          }}
          onResize={(e, direction, ref, delta, position) => {
            onResize(crop, direction, ref, position);
          }}
          onResizeStop={(
            e,
            direction,
            ref,
            delta,
            position
          ) => {
            onResizeEnd(crop, direction, ref, position);
          }}
          className={[
            "border-2",
            selectedCropId === crop.id
              ? "border-green-500 bg-green-500/10"
              : "border-blue-500 bg-blue-500/10",
          ].join(" ")}
        >
          <div className="w-full h-full relative">
            <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1">
              {crop.name || `#${index + 1}`}
            </div>
          </div>
        </Rnd>
      ))}
    </>
  );
}
