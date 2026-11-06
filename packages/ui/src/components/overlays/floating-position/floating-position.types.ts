export type FloatingPosition = "top" | "right" | "bottom" | "left";

export type FloatingAlignment = "start" | "center" | "end";

export type FloatingCoordinates = {
  top: number;
  left: number;
};

export type FloatingPlacement = {
  position: FloatingPosition;
  coordinates: FloatingCoordinates;
};

export type FloatingPositionOptions = {
  position: FloatingPosition;
  align: FloatingAlignment;
  offset: number;
  collisionPadding: number;
  viewportWidth: number;
  viewportHeight: number;
};

export type UseFloatingPositionOptions = {
  anchor: HTMLElement | null;
  content: HTMLElement | null;
  enabled: boolean;
  position: FloatingPosition;
  align: FloatingAlignment;
  offset: number;
  collisionPadding: number;
  matchTriggerWidth?: boolean;
};
