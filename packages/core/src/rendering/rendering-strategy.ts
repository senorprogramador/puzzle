import type { FoldStrategy } from "./types";

export type RenderingStrategyContract =
  | Readonly<{
      mode: "ssr";
      strategy: FoldStrategy;
    }>
  | Readonly<{
      mode: "deferred";
      strategy: Exclude<FoldStrategy, "eager">;
    }>
  | Readonly<{
      mode: "static";
    }>;
