import type { VisibilityState } from "./types";

export type VisibilityChangeHandler = (state: VisibilityState) => void;

export type VisibilityObserverContract = Readonly<{
  observe(
    targetId: string,
    onChange: VisibilityChangeHandler,
  ): () => void;
  unobserve(targetId: string): void;
  disconnect(): void;
}>;
