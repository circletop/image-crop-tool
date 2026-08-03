"use client";

import type { AlignmentGuide } from "@/types/alignment";
import type { ElementSize } from "@/types/canvas";

interface AlignmentGuidesProps {
  guides: AlignmentGuide[];
  bounds: ElementSize;
}

export function AlignmentGuides({
  guides,
  bounds,
}: AlignmentGuidesProps) {
  return (
    <>
      {guides.map((guide, index) => (
        // 参考线使用图片显示尺寸作为边界，避免缩放容器外溢。
        <div
          key={`${guide.orientation}-${guide.position}-${index}`}
          className="pointer-events-none absolute z-20 bg-rose-500"
          style={
            guide.orientation === "vertical"
              ? {
                  left: guide.position,
                  top: 0,
                  width: 1,
                  height: bounds.height,
                }
              : {
                  left: 0,
                  top: guide.position,
                  width: bounds.width,
                  height: 1,
                }
          }
        />
      ))}
    </>
  );
}
