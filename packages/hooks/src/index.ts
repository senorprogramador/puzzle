export {
  useKeyboardKeys,
  type UseKeyboardKeysOptions,
  type UseKeyboardKeysEvent,
} from "./interactions/use-keyboard-keys";

export {
  useRovingFocus,
  type RovingFocusItem,
  type RovingFocusOrientation,
  type UseRovingFocusOptions,
  type UseRovingFocusReturn,
} from "./interactions/use-roving-focus";

export {
  useListFilter,
  type UseListFilterOptions,
  type UseListFilterReturn,
} from "./state/use-list-filter";

export { useReducedMotion } from "./preferences/use-reduced-motion";

export {
  useColorScheme,
  type ColorScheme,
  type UseColorSchemeOptions,
} from "./preferences/use-color-scheme";

export {
  useAsyncAction,
  type AsyncActionStatus,
  type UseAsyncActionReturn,
} from "./state/use-async-action";

export {
  FoldProvider,
  useFoldOptimization,
  type FoldProviderProps,
  type FoldProviderVisibilityOptions,
} from "./rendering/fold-provider";

export {
  useFold,
  type UseFoldOptions,
  type UseFoldReturn,
} from "./rendering/use-fold";

export {
  useFoldState,
  useIsNearby,
  useIsVisible,
  useVisibility,
  type UseVisibilityOptions,
  type UseVisibilityReturn,
} from "./rendering/use-visibility";

export {
  useResourcePrefetch,
  type UseResourcePrefetchOptions,
  type UseResourcePrefetchReturn,
} from "./rendering/use-resource-prefetch";

export { DEFAULT_PROXIMITY_ROOT_MARGINS } from "./rendering/visibility/observer-manager";
export type {
  FoldActivationMode,
  FoldActivationTrigger,
  FoldStateSnapshot,
  ObservedVisibilityState,
  VisibilityMeasurement,
  VisibilityObserverOptions,
  VisibilityRect,
} from "./rendering/visibility/types";

export type {
  RenderingDiagnosticBoundaryContext,
  RenderingDiagnosticEvent,
  RenderingDiagnosticEventInput,
  RenderingDiagnosticResourceContext,
} from "@puzzle-ui/core/rendering";
