"use client";

import type { CropResult } from "@/types/crop";

interface ResultsPanelProps {
  results: CropResult[];
  onDownloadSingle: (
    item: CropResult,
    index: number
  ) => void;
}

export function ResultsPanel({
  results,
  onDownloadSingle,
}: ResultsPanelProps) {
  return (
    <div className="h-[260px] shrink-0 mt-4 overflow-auto border-t pt-4">
      <h2 className="text-2xl font-bold mb-4">
        裁剪结果
      </h2>

      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          gap-3
        "
      >
        {results.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow p-3 border"
          >
            <img
              src={item.url}
              alt=""
              className="w-full rounded-lg"
            />

            <button
              onClick={() => onDownloadSingle(item, index)}
              className="mt-3 w-full py-2 bg-blue-500 text-white rounded-xl"
            >
              下载图片
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
