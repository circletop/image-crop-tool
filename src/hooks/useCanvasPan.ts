"use client";

import { useEffect, useRef, useState } from "react";

interface PanStart {
  x: number;
  y: number;
  scrollLeft: number;
  scrollTop: number;
}

export function useCanvasPan(
  scrollRef: React.RefObject<HTMLDivElement | null>
) {
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);

  const panStartRef = useRef<PanStart>({
    x: 0,
    y: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

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

  const startPan = (clientX: number, clientY: number) => {
    if (!spacePressed) return;

    const container = scrollRef.current;

    if (!container) return;

    setIsPanning(true);

    panStartRef.current = {
      x: clientX,
      y: clientY,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop,
    };
  };

  const movePan = (clientX: number, clientY: number) => {
    if (!isPanning) return;

    const container = scrollRef.current;

    if (!container) return;

    const dx = clientX - panStartRef.current.x;
    const dy = clientY - panStartRef.current.y;

    container.scrollLeft =
      panStartRef.current.scrollLeft - dx;
    container.scrollTop =
      panStartRef.current.scrollTop - dy;
  };

  const stopPan = () => {
    setIsPanning(false);
  };

  return {
    isPanning,
    spacePressed,
    startPan,
    movePan,
    stopPan,
  };
}
