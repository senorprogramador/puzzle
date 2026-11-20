"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useSyncExternalStore,
  type RefCallback,
} from "react";
import {
  normalizeVisibilityObserverOptions,
} from "./visibility/observer-manager";
import { visibilityRegistry } from "./visibility/registry";
import { createFoldStateSnapshot } from "./visibility/state-machine";
import type {
  FoldActivationMode,
  FoldActivationTrigger,
  FoldStateSnapshot,
  VisibilityObserverOptions,
} from "./visibility/types";

type BoundaryHookOptions = VisibilityObserverOptions &
  Readonly<{
    id?: string;
    parentId?: string;
    activationMode?: FoldActivationMode;
    activationTrigger?: FoldActivationTrigger;
    observe?: boolean;
    initiallyActivated?: boolean;
  }>;

export type BoundaryHookResult = FoldStateSnapshot &
  Readonly<{
    id: string;
    ref: RefCallback<Element>;
    activate: () => boolean;
    deactivate: () => boolean;
  }>;

export const useBoundaryRegistration = (
  options: BoundaryHookOptions,
): BoundaryHookResult => {
  const generatedId = useId();
  const id = options.id ?? generatedId;
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const targetRef = useRef<Element | null>(null);
  const unregisterRef = useRef<(() => void) | null>(null);

  const normalizedOptions = normalizeVisibilityObserverOptions(options);
  const configurationKey = [
    normalizedOptions.rootMargin,
    normalizedOptions.threshold.join(","),
    options.parentId ?? "",
    options.activationMode ?? "one-shot",
    options.activationTrigger ?? "manual",
    options.observe === false ? "no-observe" : "observe",
    options.initiallyActivated ? "activated" : "inactive",
  ].join("|");
  const previousConfigurationRef = useRef({
    key: configurationKey,
    root: normalizedOptions.root,
  });

  const registerTarget = useCallback(
    (target: Element | null) => {
      unregisterRef.current?.();
      unregisterRef.current = null;
      targetRef.current = target;

      if (!target) return;

      const { id: _id, ...registrationOptions } = optionsRef.current;
      unregisterRef.current = visibilityRegistry.register(
        id,
        target,
        registrationOptions,
      );
    },
    [id],
  );

  const ref = useCallback<RefCallback<Element>>(
    (target) => {
      if (target === targetRef.current) return;
      registerTarget(target);
    },
    [registerTarget],
  );

  useEffect(() => {
    const previous = previousConfigurationRef.current;
    if (
      previous.key === configurationKey &&
      previous.root === normalizedOptions.root
    ) {
      return;
    }

    previousConfigurationRef.current = {
      key: configurationKey,
      root: normalizedOptions.root,
    };

    const target = targetRef.current;
    if (target) registerTarget(target);
  }, [configurationKey, normalizedOptions.root, registerTarget]);

  useEffect(
    () => () => {
      unregisterRef.current?.();
      unregisterRef.current = null;
      targetRef.current = null;
    },
    [],
  );

  const subscribe = useCallback(
    (onChange: () => void) => visibilityRegistry.subscribe(id, onChange),
    [id],
  );
  const getSnapshot = useCallback(
    () => visibilityRegistry.getSnapshot(id),
    [id],
  );
  const initialSnapshot = useMemo(
    () =>
      createFoldStateSnapshot(
        "unknown",
        options.initiallyActivated ?? false,
      ),
    [options.initiallyActivated],
  );
  const getCurrentSnapshot = useCallback(
    () =>
      visibilityRegistry.hasBoundary(id)
        ? getSnapshot()
        : initialSnapshot,
    [id, initialSnapshot, getSnapshot],
  );
  const getServerSnapshot = useCallback(
    () => initialSnapshot,
    [initialSnapshot],
  );
  const snapshot = useSyncExternalStore(
    subscribe,
    getCurrentSnapshot,
    getServerSnapshot,
  );
  const activate = useCallback(() => visibilityRegistry.activate(id), [id]);
  const deactivate = useCallback(
    () => visibilityRegistry.deactivate(id),
    [id],
  );

  return { id, ref, ...snapshot, activate, deactivate };
};
