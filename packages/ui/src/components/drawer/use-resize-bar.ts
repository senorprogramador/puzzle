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

    let offset = 0;

    document.body.style.userSelect = "none";
    document.body.style.touchAction = "none";

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      const elementOffset =
        direction === "vertical"
          ? resizeElement.offsetTop
          : resizeElement.offsetLeft;
      setDimension(
        direction === "vertical"
          ? "touches" in e
            ? e.touches[0].clientY - offset - elementOffset
            : e.clientY - offset - elementOffset
          : "touches" in e
            ? e.touches[0].clientX - offset - elementOffset
            : e.clientX - offset - elementOffset,
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
      const elementPosition =
        direction === "vertical"
          ? resizeElement.getBoundingClientRect().top
          : resizeElement.getBoundingClientRect().left;
      offset =
        direction === "vertical"
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
  }, [direction, resizeRef.current, active]);

  return { dimension, resizeRef };
};

export { useResizeBar };
