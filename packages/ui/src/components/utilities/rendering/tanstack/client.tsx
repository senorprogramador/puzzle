"use client";

export {
  FoldBoundary as TanStackFoldBoundary,
  type FoldBoundaryProps as TanStackFoldBoundaryProps,
} from "../fold-boundary";
export {
  FoldProvider as TanStackFoldProvider,
  type FoldProviderProps as TanStackFoldProviderProps,
  type FoldProviderVisibilityOptions as TanStackFoldProviderVisibilityOptions,
} from "@puzzle-ui/hooks";
export {
  DeferredBoundary as TanStackDeferredBoundary,
  type DeferredActivationStrategy as TanStackDeferredActivationStrategy,
  type DeferredBoundaryProps as TanStackDeferredBoundaryProps,
  type DeferredComponentLoader as TanStackDeferredComponentLoader,
  type DeferredComponentModule as TanStackDeferredComponentModule,
  type DeferredErrorFallback as TanStackDeferredErrorFallback,
} from "../deferred";
export {
  useFold,
  useFoldOptimization,
  type UseFoldOptions,
  type UseFoldReturn,
} from "@puzzle-ui/hooks";
export {
  useFoldState,
  useIsNearby,
  useIsVisible,
  useVisibility,
  type UseVisibilityOptions,
  type UseVisibilityReturn,
} from "@puzzle-ui/hooks";
