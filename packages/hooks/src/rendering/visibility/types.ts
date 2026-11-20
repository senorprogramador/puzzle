import type {
  FoldPriority,
  VisibilityState,
} from "@puzzle-ui/core/rendering";

export type ObservedVisibilityState = Exclude<VisibilityState, "activated">;

export type VisibilityRect = Readonly<{
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}>;

export type VisibilityMeasurement = Readonly<{
  channel: "viewport" | "proximity";
  isIntersecting: boolean;
  intersectionRatio: number;
  element: VisibilityRect;
  root?: VisibilityRect;
  time: number;
}>;

export type VisibilityObserverOptions = Readonly<{
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | readonly number[];
  priority?: FoldPriority;
}>;

export type FoldStateSnapshot = Readonly<{
  state: VisibilityState;
  visibility: ObservedVisibilityState;
  isVisible: boolean;
  isNearby: boolean;
  isActivated: boolean;
  measurement?: VisibilityMeasurement;
}>;

export type FoldActivationMode = "one-shot" | "persistent";

export type FoldActivationTrigger = "manual" | "visible" | "nearby";
