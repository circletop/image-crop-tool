"use client";

import { useRef, useState, useEffect } from "react";
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

  // 滚动容器
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [image, setImage] = useState<string | null>(null);

  const [crops, setCrops] = useState<CropArea[]>([]);
  // 当前选中的裁剪框ID
  const [selectedCropId, setSelectedCropId] = useState<number | null>(null);
  
  useEffect(() => {
    const handleDelete = (e: KeyboardEvent) => {
      if (
        e.key !== "Delete" &&
        e.key !== "Backspace"
      )
        return;

      if (!selectedCropId) return;

      setCrops((prev) =>
        prev.filter(
          (crop) => crop.id !== selectedCropId
        )
      );

      setSelectedCropId(null);
    };

    window.addEventListener(
      "keydown",
      handleDelete
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleDelete
      );
    };
  }, [selectedCropId]);

  const [results, setResults] = useState<CropResult[]>([]);
  // 缩放比例
  const [scale, setScale] = useState(1);

  // 是否在拖动平移
  const [isPanning, setIsPanning] = useState(false);

  const panStartRef = useRef({
    x: 0,
    y: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const [spacePressed, setSpacePressed] = useState(false);

  // 监听空格键控制平移
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

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
    //修改截图比例
    const scaleX =
      img.naturalWidth / img.clientWidth;

    const scaleY =
      img.naturalHeight / img.clientHeight;

    const newResults: CropResult[] = [];

    for (const crop of crops) {
      const canvas = document.createElement("canvas");

      canvas.width = crop.width;
      canvas.height = crop.height;

      const ctx = canvas.getContext("2d");

      if (!ctx) continue;

      ctx.drawImage(
        img,

        crop.x * scaleX,
        crop.y * scaleY,

        crop.width * scaleX,
        crop.height * scaleY,

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
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden">
      {/* 左侧 */}
      <div className="flex-1 flex flex-col p-2 md:p-4 overflow-hidden min-h-0">
        {/* 工具栏 */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="border bg-white rounded-lg p-2"
          />

          <button
            onClick={addCrop}
            className="px-3 py-2 text-sm md:text-base bg-blue-500 text-white rounded-xl"
          >
            新增裁剪框
          </button>

          <button
            onClick={handleCrop}
            className="px-3 py-2 text-sm md:text-base bg-green-500 text-white rounded-xl"
          >
            开始裁剪
          </button>
          <button
            onClick={() =>
              setScale((prev) =>
                Math.max(prev - 0.1, 0.2)
              )
            }
            className="px-3 py-2 text-sm md:text-base bg-gray-200 rounded-xl"
          >
            缩小
          </button>
          <button
            onClick={() =>
              setScale((prev) =>
                Math.min(prev + 0.1, 5)
              )
            }
            className="px-3 py-2 text-sm md:text-base bg-gray-200 rounded-xl"
          >
            放大
          </button>

          <div className="flex items-center px-3 font-medium">
            {Math.round(scale * 100)}%
          </div>

          <button
            onClick={downloadAll}
            className="px-3 py-2 text-sm md:text-base bg-black text-white rounded-xl"
          >
            批量下载
          </button>
        </div>

        {/* 图片区域 */}
        <div className="flex-1 min-h-0 mt-2 overflow-hidden">
          <div
            ref={scrollRef}
            onMouseDown={(e) => {
              if (!spacePressed) return;

              const container = scrollRef.current;

              if (!container) return;

              setIsPanning(true);

              panStartRef.current = {
                x: e.clientX,
                y: e.clientY,
                scrollLeft: container.scrollLeft,
                scrollTop: container.scrollTop,
              };
            }}
            onMouseMove={(e) => {
              if (!isPanning) return;

              const container = scrollRef.current;

              if (!container) return;

              const dx =
                e.clientX - panStartRef.current.x;

              const dy =
                e.clientY - panStartRef.current.y;

              container.scrollLeft =
                panStartRef.current.scrollLeft - dx;

              container.scrollTop =
                panStartRef.current.scrollTop - dy;
            }}
            onMouseUp={() => {
              setIsPanning(false);
            }}
            onMouseLeave={() => {
              setIsPanning(false);
            }}
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
                    className="
                    max-w-none
                    select-none
                    touch-none
                  "
                  />

                  {crops.map((crop, index) => (
                    <Rnd
                      onMouseDown={() => {
                        setSelectedCropId(crop.id);
                      }}
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
                          #{index + 1}
                        </div>
                      </div>
                    </Rnd>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* 裁剪结果 */}
        <div className="h-[260px] shrink-0 mt-4 overflow-auto border-t pt-4">
          <h2 className="text-2xl font-bold mb-4">
            裁剪结果
          </h2>

          <div className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-4
            gap-3
          ">
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
      <div className="
        w-full
        lg:w-[320px]
        bg-white
        border-t
        lg:border-t-0
        lg:border-l
        overflow-auto
        max-h-[40vh]
        lg:max-h-none
      ">
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