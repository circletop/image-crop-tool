"use client";

import type {
  CropArea,
  CropNumericField,
} from "@/types/crop";
import {
  ASPECT_RATIO_TEMPLATES,
  applyAspectRatio,
  getAspectRatioByValue,
  getAspectRatioValue,
  updateCropNumericField,
} from "@/utils/aspectRatios";
import { LivePreviewPanel } from "@/components/crop-workspace/LivePreviewPanel";

const CROP_FIELDS: CropNumericField[] = [
  "width",
  "height",
  "x",
  "y",
];

interface CropOptionsPanelProps {
  crops: CropArea[];
  selectedCropId: number | null;
  imageRef: React.RefObject<HTMLImageElement | null>;
  imageLoadVersion: number;
  onUpdateCrop: (
    id: number,
    data: Partial<CropArea>
  ) => void;
  onRemoveCrop: (id: number) => void;
  onSelectCrop: (id: number) => void;
}

export function CropOptionsPanel({
  crops,
  selectedCropId,
  imageRef,
  imageLoadVersion,
  onUpdateCrop,
  onRemoveCrop,
  onSelectCrop,
}: CropOptionsPanelProps) {
  const selectedCrop =
    crops.find((crop) => crop.id === selectedCropId) ??
    null;

  return (
    <div
      className="
        w-full
        lg:w-[320px]
        bg-white
        border-t
        lg:border-t-0
        lg:border-l
        overflow-auto
        max-h-[40vh]
        lg:max-h-none
      "
    >
      <div className="p-5">
        <LivePreviewPanel
          crop={selectedCrop}
          imageRef={imageRef}
          imageLoadVersion={imageLoadVersion}
        />

        <h2 className="text-3xl font-bold mb-6">
          裁剪选项
        </h2>

        {crops.map((crop, index) => (
          <div
            key={crop.id}
            onMouseDown={() => onSelectCrop(crop.id)}
            className={`
              mb-6
              border
              rounded-2xl
              p-4
              ${
                selectedCropId === crop.id
                  ? "border-green-500"
                  : ""
              }
            `}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold">
                {crop.name || `裁剪区域 ${index + 1}`}
              </div>

              <button
                onClick={() => onRemoveCrop(crop.id)}
                className="text-red-500"
              >
                删除
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">
                  名称
                </label>

                <input
                  type="text"
                  value={crop.name}
                  onChange={(e) =>
                    onUpdateCrop(crop.id, {
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  裁剪比例
                </label>

                <select
                  value={getAspectRatioValue(
                    crop.aspectRatio
                  )}
                  onChange={(e) => {
                    const nextCrop = applyAspectRatio(
                      crop,
                      getAspectRatioByValue(e.target.value)
                    );

                    onUpdateCrop(crop.id, nextCrop);
                  }}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  {ASPECT_RATIO_TEMPLATES.map(
                    (template) => (
                      <option
                        key={template.value}
                        value={template.value}
                      >
                        {template.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {CROP_FIELDS.map((field) => (
                <div key={field}>
                  <label className="text-sm text-gray-500 capitalize">
                    {field}
                  </label>

                  <input
                    type="number"
                    value={crop[field]}
                    onChange={(e) =>
                      onUpdateCrop(
                        crop.id,
                        updateCropNumericField(
                          crop,
                          field,
                          Number(e.target.value)
                        )
                      )
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
