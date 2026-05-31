"use client";

import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface CropArea {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropResult {
  id: number;
  blob: Blob;
  url: string;
}

export default function CropWorkspace() {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [image, setImage] = useState<string | null>(null);

  const [crops, setCrops] = useState<CropArea[]>([]);

  const [results, setResults] = useState<CropResult[]>([]);

  // 上传图片
  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setImage(url);

    setCrops([]);
    setResults([]);
  };

  // 新增裁剪框
  const addCrop = () => {
    setCrops((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: 100,
        y: 100,
        width: 300,
        height: 300,
      },
    ]);
  };

  // 更新裁剪框
  const updateCrop = (
    id: number,
    data: Partial<CropArea>
  ) => {
    setCrops((prev) =>
      prev.map((crop) =>
        crop.id === id
          ? {
              ...crop,
              ...data,
            }
          : crop
      )
    );
  };

  // 删除裁剪框
  const removeCrop = (id: number) => {
    setCrops((prev) =>
      prev.filter((crop) => crop.id !== id)
    );
  };

  // 开始裁剪
  const handleCrop = async () => {
    if (!imageRef.current) return;

    const img = imageRef.current;

    const newResults: CropResult[] = [];

    for (const crop of crops) {
      const canvas = document.createElement("canvas");

      canvas.width = crop.width;
      canvas.height = crop.height;

      const ctx = canvas.getContext("2d");

      if (!ctx) continue;

      ctx.drawImage(
        img,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      const blob = await new Promise<Blob | null>(
        (resolve) => {
          canvas.toBlob(resolve, "image/png");
        }
      );

      if (!blob) continue;

      const url = URL.createObjectURL(blob);

      newResults.push({
        id: crop.id,
        blob,
        url,
      });
    }

    setResults(newResults);
  };

  // 单张下载
  const downloadSingle = (
    item: CropResult,
    index: number
  ) => {
    saveAs(item.blob, `crop-${index + 1}.png`);
  };

  // 批量下载
  const downloadAll = async () => {
    const zip = new JSZip();

    results.forEach((item, index) => {
      zip.file(
        `crop-${index + 1}.png`,
        item.blob
      );
    });

    const content = await zip.generateAsync({
      type: "blob",
    });

    saveAs(content, "cropped-images.zip");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左侧 */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        {/* 工具栏 */}
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="border bg-white rounded-lg p-2"
          />

          <button
            onClick={addCrop}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl"
          >
            新增裁剪框
          </button>

          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-green-500 text-white rounded-xl"
          >
            开始裁剪
          </button>

          <button
            onClick={downloadAll}
            className="px-4 py-2 bg-black text-white rounded-xl"
          >
            批量下载
          </button>
        </div>

        {/* 图片区域 */}
        <div className="relative bg-white rounded-2xl shadow overflow-hidden border min-h-[600px]">
          {image && (
            <>
              <img
                ref={imageRef}
                src={image}
                alt=""
                className="max-w-full"
              />

              {crops.map((crop, index) => (
                <Rnd
                  key={crop.id}
                  size={{
                    width: crop.width,
                    height: crop.height,
                  }}
                  position={{
                    x: crop.x,
                    y: crop.y,
                  }}
                  bounds="parent"
                  onDragStop={(e, d) => {
                    updateCrop(crop.id, {
                      x: d.x,
                      y: d.y,
                    });
                  }}
                  onResizeStop={(
                    e,
                    direction,
                    ref,
                    delta,
                    position
                  ) => {
                    updateCrop(crop.id, {
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      ...position,
                    });
                  }}
                  className="border-2 border-blue-500 bg-blue-500/10"
                >
                  <div className="relative w-full h-full">
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1">
                      #{index + 1}
                    </div>
                  </div>
                </Rnd>
              ))}
            </>
          )}
        </div>

        {/* 裁剪结果 */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            裁剪结果
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  onClick={() =>
                    downloadSingle(item, index)
                  }
                  className="mt-3 w-full py-2 bg-blue-500 text-white rounded-xl"
                >
                  下载图片
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧参数栏 */}
      <div className="w-[320px] bg-white border-l overflow-auto">
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
                  onClick={() =>
                    removeCrop(crop.id)
                  }
                  className="text-red-500"
                >
                  删除
                </button>
              </div>

              <div className="space-y-4">
                {["width", "height", "x", "y"].map(
                  (field) => (
                    <div key={field}>
                      <label className="text-sm text-gray-500 capitalize">
                        {field}
                      </label>

                      <input
                        type="number"
                        value={
                          crop[
                            field as keyof CropArea
                          ] as number
                        }
                        onChange={(e) =>
                          updateCrop(crop.id, {
                            [field]: Number(
                              e.target.value
                            ),
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}