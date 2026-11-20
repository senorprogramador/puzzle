"use client";

export {
  FoldBoundary as NextFoldBoundary,
  type FoldBoundaryProps as NextFoldBoundaryProps,
} from "../fold-boundary";
export {
  FoldProvider as NextFoldProvider,
  type FoldProviderProps as NextFoldProviderProps,
  type FoldProviderVisibilityOptions as NextFoldProviderVisibilityOptions,
} from "@puzzle-ui/hooks";
export {
  DeferredBoundary as NextDeferredBoundary,
  type DeferredActivationStrategy as NextDeferredActivationStrategy,
  type DeferredBoundaryProps as NextDeferredBoundaryProps,
  type DeferredComponentLoader as NextDeferredComponentLoader,
  type DeferredComponentModule as NextDeferredComponentModule,
  type DeferredErrorFallback as NextDeferredErrorFallback,
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
