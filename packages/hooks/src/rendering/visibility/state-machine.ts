import type {
  FoldStateSnapshot,
  ObservedVisibilityState,
  VisibilityMeasurement,
} from "./types";

const ALLOWED_TRANSITIONS = Object.freeze({
  unknown: Object.freeze(["outside", "nearby", "visible"] as const),
  outside: Object.freeze(["nearby", "visible"] as const),
  nearby: Object.freeze(["outside", "visible"] as const),
  visible: Object.freeze(["outside", "nearby"] as const),
} satisfies Readonly<
  Record<ObservedVisibilityState, readonly ObservedVisibilityState[]>
>);

const includesState = (
  states: readonly ObservedVisibilityState[],
  state: ObservedVisibilityState,
) => states.includes(state);

export const canTransitionVisibility = (
  from: ObservedVisibilityState,
  to: ObservedVisibilityState,
) => from === to || includesState(ALLOWED_TRANSITIONS[from], to);

export const transitionVisibility = (
  from: ObservedVisibilityState,
  to: ObservedVisibilityState,
): ObservedVisibilityState =>
  canTransitionVisibility(from, to) ? to : from;

export const createFoldStateSnapshot = (
  visibility: ObservedVisibilityState,
  isActivated: boolean,
  measurement?: VisibilityMeasurement,
): FoldStateSnapshot =>
  Object.freeze({
    state: isActivated ? "activated" : visibility,
    visibility,
    isVisible: visibility === "visible",
    isNearby: visibility === "nearby" || visibility === "visible",
    isActivated,
    ...(measurement === undefined ? {} : { measurement }),
  });

export const UNKNOWN_FOLD_STATE = createFoldStateSnapshot("unknown", false);
