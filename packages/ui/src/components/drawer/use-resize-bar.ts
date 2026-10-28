import { useEffect, useRef, useState } from "react";

const useResizeBar = (
  position: "left" | "right" | "top" | "bottom",
  active: boolean,
) => {
  const resizeRef = useRef<HTMLButtonElement | null>(null);
  const [dimension, setDimension] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const { current: resizeElement } = resizeRef;
    setDimension(null);

    if (!resizeElement) return;

    let offset = 0;

    document.body.style.userSelect = "none";
    document.body.style.touchAction = "none";

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();

      switch (position) {
        case "top":
          setDimension(
            "touches" in e ? e.touches[0].clientY + offset : e.clientY + offset,
          );
          break;
        case "bottom":
          setDimension(
            "touches" in e
              ? e.touches[0].clientY - offset - resizeElement.offsetTop
              : e.clientY - offset - resizeElement.offsetTop,
          );
          break;
        case "left":
          setDimension(
            "touches" in e ? e.touches[0].clientX + offset : e.clientX + offset,
          );
          break;
        case "right":
          setDimension(
            "touches" in e
              ? e.touches[0].clientX - offset - resizeElement.offsetLeft
              : e.clientX - offset - resizeElement.offsetLeft,
          );
          break;
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      const elementPosition = ["top", "bottom"].includes(position)
        ? resizeElement.getBoundingClientRect().top
        : resizeElement.getBoundingClientRect().left;
      offset = ["top", "bottom"].includes(position)
        ? "touches" in e
          ? e.touches[0].clientY - elementPosition
          : e.clientY - elementPosition
        : "touches" in e
          ? e.touches[0].clientX - elementPosition
          : e.clientX - elementPosition;
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
      document.body.style.removeProperty("touch-action");
    };
  }, [position, resizeRef.current, active]);

  return { dimension, resizeRef };
};

export { useResizeBar };
