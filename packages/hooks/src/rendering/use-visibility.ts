"use client";

import {
  useCallback,
  useSyncExternalStore,
  type RefCallback,
} from "react";
import { useBoundaryRegistration } from "./use-boundary-registration";
import { visibilityRegistry } from "./visibility/registry";
import type {
  FoldStateSnapshot,
  ObservedVisibilityState,
  VisibilityMeasurement,
  VisibilityObserverOptions,
} from "./visibility/types";

export type UseVisibilityOptions = VisibilityObserverOptions &
  Readonly<{
    id?: string;
    parentId?: string;
  }>;

export type UseVisibilityReturn = Readonly<{
  id: string;
  ref: RefCallback<Element>;
  state: ObservedVisibilityState;
  isVisible: boolean;
  isNearby: boolean;
  measurement?: VisibilityMeasurement;
}>;

export const useVisibility = (
  options: UseVisibilityOptions = {},
): UseVisibilityReturn => {
  const boundary = useBoundaryRegistration({
    ...options,
    activationMode: "one-shot",
    activationTrigger: "manual",
    observe: true,
    initiallyActivated: false,
  });

  return {
    id: boundary.id,
    ref: boundary.ref,
    state: boundary.visibility,
    isVisible: boundary.isVisible,
    isNearby: boundary.isNearby,
    ...(boundary.measurement === undefined
      ? {}
      : { measurement: boundary.measurement }),
  };
};

export const useFoldState = (id: string): FoldStateSnapshot => {
  const subscribe = useCallback(
    (onChange: () => void) => visibilityRegistry.subscribe(id, onChange),
    [id],
  );
  const getSnapshot = useCallback(
    () => visibilityRegistry.getSnapshot(id),
    [id],
  );
  const getServerSnapshot = useCallback(
    () => visibilityRegistry.getServerSnapshot(id),
    [id],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export const useIsVisible = (id: string) => useFoldState(id).isVisible;

export const useIsNearby = (id: string) => useFoldState(id).isNearby;
