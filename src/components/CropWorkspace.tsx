"use client";

import { ImageCanvas } from "@/components/crop-workspace/ImageCanvas";
import { CropOptionsPanel } from "@/components/crop-workspace/CropOptionsPanel";
import { ResultsPanel } from "@/components/crop-workspace/ResultsPanel";
import { WorkspaceToolbar } from "@/components/crop-workspace/WorkspaceToolbar";
import { useCropWorkspace } from "@/hooks/useCropWorkspace";

export default function CropWorkspace() {
  const workspace = useCropWorkspace();

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden">
      <div className="flex-1 flex flex-col p-2 md:p-4 overflow-hidden min-h-0">
        <WorkspaceToolbar
          scale={workspace.scale}
          onUpload={workspace.handleUpload}
          onAddCrop={workspace.addCrop}
          onCrop={workspace.handleCrop}
          onZoomOut={workspace.decreaseZoom}
          onZoomIn={workspace.increaseZoom}
          onDownloadAll={workspace.downloadAll}
        />

        <ImageCanvas
          image={workspace.image}
          crops={workspace.crops}
          selectedCropId={workspace.selectedCropId}
          scale={workspace.scale}
          isPanning={workspace.isPanning}
          spacePressed={workspace.spacePressed}
          imageRef={workspace.imageRef}
          scrollRef={workspace.scrollRef}
          canvasRef={workspace.canvasRef}
          onImageLoad={workspace.handleImageLoad}
          onSelectCrop={workspace.setSelectedCropId}
          onUpdateCrop={workspace.updateCrop}
          onZoomAtPoint={workspace.zoomAtPoint}
          onStartPan={workspace.startPan}
          onMovePan={workspace.movePan}
          onStopPan={workspace.stopPan}
        />

        <ResultsPanel
          results={workspace.results}
          onDownloadSingle={workspace.downloadSingle}
        />
      </div>

      <CropOptionsPanel
        crops={workspace.crops}
        selectedCropId={workspace.selectedCropId}
        imageRef={workspace.imageRef}
        imageLoadVersion={workspace.imageLoadVersion}
        onUpdateCrop={workspace.updateCrop}
        onRemoveCrop={workspace.removeCrop}
        onSelectCrop={workspace.setSelectedCropId}
      />
    </div>
  );
}
