import { useEffect, useRef, useState } from "react";

const useResizeBar = (
  direction: "horizontal" | "vertical",
  active: boolean,
) => {
  const resizeRef = useRef<HTMLButtonElement | null>(null);
  const [dimension, setDimension] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const { current: resizeElement } = resizeRef;
    setDimension(null);

    if (!resizeElement) return;

    document.body.style.userSelect = "none";

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      setDimension(
        direction === "vertical"
          ? "touches" in e
            ? e.touches[0].clientY
            : e.clientY
          : "touches" in e
            ? e.touches[0].clientX
            : e.clientX,
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleMouseMove);
      document.addEventListener("touchend", handleMouseUp);
    };

    resizeElement.addEventListener("mousedown", handleMouseDown, true);
    resizeElement.addEventListener("touchstart", handleMouseDown, true);

    return () => {
      resizeElement.removeEventListener("mousedown", handleMouseDown);
      resizeElement.removeEventListener("touchstart", handleMouseDown);
      document.body.style.removeProperty("user-select");
    };
  }, [direction, resizeRef.current, active]);

  return { dimension, resizeRef };
};

export { useResizeBar };
