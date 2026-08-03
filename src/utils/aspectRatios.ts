import type { AspectRatioTemplate } from "@/types/aspectRatio";
import type { CropArea } from "@/types/crop";

export const ASPECT_RATIO_TEMPLATES: AspectRatioTemplate[] = [
  {
    label: "自由",
    value: "free",
    ratio: null,
  },
  {
    label: "1:1",
    value: "1:1",
    ratio: 1,
  },
  {
    label: "4:3",
    value: "4:3",
    ratio: 4 / 3,
  },
  {
    label: "3:4",
    value: "3:4",
    ratio: 3 / 4,
  },
  {
    label: "16:9",
    value: "16:9",
    ratio: 16 / 9,
  },
  {
    label: "9:16",
    value: "9:16",
    ratio: 9 / 16,
  },
];

export function getAspectRatioValue(
  ratio: number | null
) {
  return (
    ASPECT_RATIO_TEMPLATES.find(
      (template) => template.ratio === ratio
    )?.value ?? "free"
  );
}

export function getAspectRatioByValue(value: string) {
  return (
    ASPECT_RATIO_TEMPLATES.find(
      (template) => template.value === value
    )?.ratio ?? null
  );
}

export function applyAspectRatio(
  crop: CropArea,
  ratio: number | null
): CropArea {
  if (!ratio) {
    return {
      ...crop,
      aspectRatio: null,
    };
  }

  return {
    ...crop,
    aspectRatio: ratio,
    // 切换比例时固定当前宽度，只重算高度，避免裁剪框位置突然跳动。
    height: Math.max(1, Math.round(crop.width / ratio)),
  };
}

export function updateCropNumericField(
  crop: CropArea,
  field: "width" | "height" | "x" | "y",
  value: number
): Partial<CropArea> {
  if (!crop.aspectRatio) {
    return {
      [field]: value,
    };
  }

  if (field === "width") {
    return {
      width: value,
      // 锁定比例后，编辑宽高任一项都同步重算另一项。
      height: Math.max(
        1,
        Math.round(value / crop.aspectRatio)
      ),
    };
  }

  if (field === "height") {
    return {
      height: value,
      // 保持和宽度分支一致的四舍五入策略，避免连续输入时尺寸抖动。
      width: Math.max(
        1,
        Math.round(value * crop.aspectRatio)
      ),
    };
  }

  return {
    [field]: value,
  };
}
