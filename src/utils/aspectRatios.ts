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
      height: Math.max(
        1,
        Math.round(value / crop.aspectRatio)
      ),
    };
  }

  if (field === "height") {
    return {
      height: value,
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
