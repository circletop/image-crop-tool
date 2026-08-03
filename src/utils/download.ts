import { saveAs } from "file-saver";
import JSZip from "jszip";
import type { CropResult } from "@/types/crop";

function getCropFileName(item: CropResult, index: number) {
  // 浏览器下载文件名需要过滤系统保留字符，空名称则回退到序号命名。
  const safeName = item.name
    .trim()
    .replace(/[<>:"/\\|?*]/g, "-");

  return `${safeName || `crop-${index + 1}`}.png`;
}

export function downloadCropResult(
  item: CropResult,
  index: number
) {
  saveAs(item.blob, getCropFileName(item, index));
}

export async function downloadCropResultsZip(
  results: CropResult[]
) {
  const zip = new JSZip();

  results.forEach((item, index) => {
    zip.file(getCropFileName(item, index), item.blob);
  });

  const content = await zip.generateAsync({
    type: "blob",
  });

  saveAs(content, "cropped-images.zip");
}
