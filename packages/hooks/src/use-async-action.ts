"use client";

import { useCallback, useRef, useState } from "react";

export type AsyncActionStatus = "idle" | "loading" | "success" | "error";

export type UseAsyncActionReturn<T> = {
  status: AsyncActionStatus;
  error: unknown | null;
  run: (input: T) => Promise<boolean>;
  reset: () => void;
};

export const useAsyncAction = <T,>(
  action: (input: T) => void | Promise<void>,
): UseAsyncActionReturn<T> => {
  const [status, setStatus] = useState<AsyncActionStatus>("idle");
  const [error, setError] = useState<unknown | null>(null);
  const isRunning = useRef(false);

  const run = useCallback(
    async (input: T) => {
      if (isRunning.current) {
        return false;
      }

      isRunning.current = true;
      setStatus("loading");
      setError(null);

      try {
        await action(input);
        setStatus("success");
        return true;
      } catch (reason) {
        setStatus("error");
        setError(reason);
        return false;
      } finally {
        isRunning.current = false;
      }
    },
    [action],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, run, reset };
};
