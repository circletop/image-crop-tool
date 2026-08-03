import type { CropArea, CropResult } from "@/types/crop";

function canvasToPngBlob(
  canvas: HTMLCanvasElement
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
}

export async function cropImageByAreas(
  image: HTMLImageElement,
  crops: CropArea[]
): Promise<CropResult[]> {
  // 裁剪框坐标基于页面显示尺寸，真正截图时需要换算回图片原始像素。
  const scaleX = image.naturalWidth / image.clientWidth;
  const scaleY = image.naturalHeight / image.clientHeight;
  const results: CropResult[] = [];

  for (const crop of crops) {
    const canvas = document.createElement("canvas");

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) continue;

    // drawImage 前四个参数取原图区域，后四个参数把结果绘制到导出画布。
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

    const blob = await canvasToPngBlob(canvas);

    if (!blob) continue;

    results.push({
      id: crop.id,
      name: crop.name,
      blob,
      url: URL.createObjectURL(blob),
    });
  }

  return results;
}
