import { saveAs } from "file-saver";
import JSZip from "jszip";
import type { CropResult } from "@/types/crop";

export function downloadCropResult(
  item: CropResult,
  index: number
) {
  saveAs(item.blob, `crop-${index + 1}.png`);
}

export async function downloadCropResultsZip(
  results: CropResult[]
) {
  const zip = new JSZip();

  results.forEach((item, index) => {
    zip.file(`crop-${index + 1}.png`, item.blob);
  });

  const content = await zip.generateAsync({
    type: "blob",
  });

  saveAs(content, "cropped-images.zip");
}
