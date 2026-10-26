import { useEffect, useRef } from "react";

export type KeyboardEventType = "keydown" | "keyup";

export interface UseKeyboardKeysEvent {
  key: string;
  type: KeyboardEventType;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  repeat: boolean;
  nativeEvent: KeyboardEvent;
}

export interface UseKeyboardKeysOptions {
  keys: readonly string[];
  onKeyDown?: (event: UseKeyboardKeysEvent) => void;
  onKeyUp?: (event: UseKeyboardKeysEvent) => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
}

function normalizeKey(key: string): string {
  const normalized = key.toLowerCase();

  if (normalized === "space" || normalized === "spacebar") {
    return " ";
  }

  return normalized;
}

type ModifierKey = "shift" | "control" | "meta" | "alt";

export function useKeyboardKeys({
  keys,
  onKeyDown,
  onKeyUp,
  preventDefault = false,
  stopPropagation = false,
  enabled = true,
}: UseKeyboardKeysOptions): void {
  const pressedKeys = useRef(new Set<string>());
  const callbacksRef = useRef({ onKeyDown, onKeyUp });

  useEffect(() => {
    callbacksRef.current = { onKeyDown, onKeyUp };
  }, [onKeyDown, onKeyUp]);

  const keysSignature = JSON.stringify(
    [...new Set(keys.map(normalizeKey))].sort(),
  );

  const hasCallback = Boolean(onKeyDown || onKeyUp);

  useEffect(() => {
    if (!enabled || !hasCallback) {
      pressedKeys.current.clear();
      return;
    }

    const subscribedKeys = new Set<string>(
      JSON.parse(keysSignature) as string[],
    );

    if (subscribedKeys.size === 0) {
      pressedKeys.current.clear();
      return;
    }

    const getModifierState = (
      modifier: ModifierKey,
      nativeState: boolean,
      normalizedKey: string,
      type: KeyboardEventType,
    ): boolean => {
      if (normalizedKey === modifier) {
        return type === "keydown";
      }

      return nativeState || pressedKeys.current.has(modifier);
    };

    const handleKeyboardEvent = (
      event: KeyboardEvent,
      type: KeyboardEventType,
    ) => {
      const normalizedKey = normalizeKey(event.key);

      if (type === "keydown") {
        pressedKeys.current.add(normalizedKey);
      } else {
        pressedKeys.current.delete(normalizedKey);
      }

      if (!subscribedKeys.has(normalizedKey)) {
        return;
      }

      const callback =
        type === "keydown"
          ? callbacksRef.current.onKeyDown
          : callbacksRef.current.onKeyUp;

      if (!callback) {
        return;
      }

      if (preventDefault && event.cancelable) {
        event.preventDefault();
      }

      if (stopPropagation) {
        event.stopPropagation();
      }

      callback({
        key: event.key,
        type,
        shiftKey: getModifierState(
          "shift",
          event.shiftKey,
          normalizedKey,
          type,
        ),
        ctrlKey: getModifierState(
          "control",
          event.ctrlKey,
          normalizedKey,
          type,
        ),
        metaKey: getModifierState("meta", event.metaKey, normalizedKey, type),
        altKey: getModifierState("alt", event.altKey, normalizedKey, type),
        repeat: event.repeat,
        nativeEvent: event,
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyboardEvent(event, "keydown");
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      handleKeyboardEvent(event, "keyup");
    };

    const clearPressedKeys = () => {
      pressedKeys.current.clear();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearPressedKeys();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    window.addEventListener("blur", clearPressedKeys);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("blur", clearPressedKeys);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      clearPressedKeys();
    };
  }, [enabled, hasCallback, keysSignature, preventDefault, stopPropagation]);
}
