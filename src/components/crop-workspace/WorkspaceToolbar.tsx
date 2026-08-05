"use client";

interface WorkspaceToolbarProps {
  canRedo: boolean;
  canUndo: boolean;
  scale: number;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddCrop: () => void;
  onCrop: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onDownloadAll: () => void;
  onRedo: () => void;
  onUndo: () => void;
}

export function WorkspaceToolbar({
  canRedo,
  canUndo,
  scale,
  onUpload,
  onAddCrop,
  onCrop,
  onZoomOut,
  onZoomIn,
  onDownloadAll,
  onRedo,
  onUndo,
}: WorkspaceToolbarProps) {
  const historyButtonClass =
    "px-3 py-2 text-sm md:text-base bg-gray-200 rounded-xl disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="border bg-white rounded-lg p-2"
      />

      <button
        onClick={onAddCrop}
        className="px-3 py-2 text-sm md:text-base bg-blue-500 text-white rounded-xl"
      >
        新增裁剪框
      </button>

      <button
        onClick={onCrop}
        className="px-3 py-2 text-sm md:text-base bg-green-500 text-white rounded-xl"
      >
        开始裁剪
      </button>

      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={historyButtonClass}
      >
        撤销
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={historyButtonClass}
      >
        重做
      </button>

      <button
        onClick={onZoomOut}
        className="px-3 py-2 text-sm md:text-base bg-gray-200 rounded-xl"
      >
        缩小
      </button>

      <button
        onClick={onZoomIn}
        className="px-3 py-2 text-sm md:text-base bg-gray-200 rounded-xl"
      >
        放大
      </button>

      <div className="flex items-center px-3 font-medium">
        {Math.round(scale * 100)}%
      </div>

      <button
        onClick={onDownloadAll}
        className="px-3 py-2 text-sm md:text-base bg-black text-white rounded-xl"
      >
        批量下载
      </button>
    </div>
  );
}
