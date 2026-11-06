import type {
  FloatingAlignment,
  FloatingCoordinates,
  FloatingPlacement,
  FloatingPosition,
  FloatingPositionOptions,
} from "./floating-position.types";

const getPositionCoordinates = (
  position: FloatingPosition,
  align: FloatingAlignment,
  anchor: DOMRect,
  content: DOMRect,
  offset: number,
): FloatingCoordinates => {
  let top = 0;
  let left = 0;

  switch (position) {
    case "top":
      top = anchor.top - content.height - offset;
      break;

    case "right":
      left = anchor.right + offset;
      break;

    case "bottom":
      top = anchor.bottom + offset;
      break;

    case "left":
      left = anchor.left - content.width - offset;
      break;
  }

  if (position === "top" || position === "bottom") {
    switch (align) {
      case "start":
        left = anchor.left;
        break;

      case "center":
        left = anchor.left + (anchor.width - content.width) / 2;
        break;

      case "end":
        left = anchor.right - content.width;
        break;
    }
  } else {
    switch (align) {
      case "start":
        top = anchor.top;
        break;

      case "center":
        top = anchor.top + (anchor.height - content.height) / 2;
        break;

      case "end":
        top = anchor.bottom - content.height;
        break;
    }
  }

  return { top, left };
};

const getOppositePosition = (position: FloatingPosition): FloatingPosition => {
  switch (position) {
    case "top":
      return "bottom";

    case "right":
      return "left";

    case "bottom":
      return "top";

    case "left":
      return "right";
  }
};

const getFallbackPositions = (
  position: FloatingPosition,
): FloatingPosition[] => {
  const opposite = getOppositePosition(position);

  const remaining: FloatingPosition[] = (
    ["top", "right", "bottom", "left"] as FloatingPosition[]
  ).filter((item) => item !== position && item !== opposite);

  return [position, opposite, ...remaining];
};

const fitsViewport = (
  coordinates: FloatingCoordinates,
  content: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
  padding: number,
): boolean => {
  return (
    coordinates.top >= padding &&
    coordinates.left >= padding &&
    coordinates.top + content.height <= viewportHeight - padding &&
    coordinates.left + content.width <= viewportWidth - padding
  );
};

const clampPosition = (
  coordinates: FloatingCoordinates,
  content: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
  padding: number,
): FloatingCoordinates => {
  const maxLeft = Math.max(padding, viewportWidth - content.width - padding);
  const maxTop = Math.max(padding, viewportHeight - content.height - padding);

  return {
    top: Math.min(Math.max(coordinates.top, padding), maxTop),
    left: Math.min(Math.max(coordinates.left, padding), maxLeft),
  };
};

const calculatePosition = (
  anchor: DOMRect,
  content: DOMRect,
  {
    position,
    align,
    offset,
    collisionPadding,
    viewportWidth,
    viewportHeight,
  }: FloatingPositionOptions,
): FloatingPlacement => {
  const candidates = getFallbackPositions(position);

  for (const candidate of candidates) {
    const coordinates = getPositionCoordinates(
      candidate,
      align,
      anchor,
      content,
      offset,
    );

    if (
      fitsViewport(
        coordinates,
        content,
        viewportWidth,
        viewportHeight,
        collisionPadding,
      )
    ) {
      return {
        position: candidate,
        coordinates,
      };
    }
  }

  const preferredCoordinates = getPositionCoordinates(
    position,
    align,
    anchor,
    content,
    offset,
  );

  return {
    position,
    coordinates: clampPosition(
      preferredCoordinates,
      content,
      viewportWidth,
      viewportHeight,
      collisionPadding,
    ),
  };
};

export {
  calculatePosition,
  clampPosition,
  fitsViewport,
  getFallbackPositions,
  getOppositePosition,
  getPositionCoordinates,
};
