"use client";

import type {
  CropArea,
  CropNumericField,
} from "@/types/crop";

const CROP_FIELDS: CropNumericField[] = [
  "width",
  "height",
  "x",
  "y",
];

interface CropOptionsPanelProps {
  crops: CropArea[];
  onUpdateCrop: (
    id: number,
    data: Partial<CropArea>
  ) => void;
  onRemoveCrop: (id: number) => void;
}

export function CropOptionsPanel({
  crops,
  onUpdateCrop,
  onRemoveCrop,
}: CropOptionsPanelProps) {
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
        <h2 className="text-3xl font-bold mb-6">
          裁剪选项
        </h2>

        {crops.map((crop, index) => (
          <div
            key={crop.id}
            className="mb-6 border rounded-2xl p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold">
                裁剪区域 {index + 1}
              </div>

              <button
                onClick={() => onRemoveCrop(crop.id)}
                className="text-red-500"
              >
                删除
              </button>
            </div>

            <div className="space-y-4">
              {CROP_FIELDS.map((field) => (
                <div key={field}>
                  <label className="text-sm text-gray-500 capitalize">
                    {field}
                  </label>

                  <input
                    type="number"
                    value={crop[field]}
                    onChange={(e) =>
                      onUpdateCrop(crop.id, {
                        [field]: Number(e.target.value),
                      })
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
