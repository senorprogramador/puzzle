import { useCallback, useState } from "react";

import type { ImageSource } from "./image.types";
import { hasImageSource } from "./image.utils";

type ImageStatus = "loading" | "loaded" | "error";

type ImageState = {
  source: ImageSource | null | undefined;
  fallbackSource: ImageSource | null | undefined;
  usingFallback: boolean;
  status: ImageStatus;
};

const createImageState = (
  source: ImageSource | null | undefined,
  fallbackSource: ImageSource | null | undefined,
): ImageState => {
  const usingFallback =
    !hasImageSource(source) && hasImageSource(fallbackSource);

  return {
    source,
    fallbackSource,
    usingFallback,
    status: "loading",
  };
};

const useImageState = (
  source: ImageSource | null | undefined,
  fallbackSource: ImageSource | null | undefined,
) => {
  const [state, setState] = useState<ImageState>(() =>
    createImageState(source, fallbackSource),
  );

  const isCurrentSource =
    Object.is(state.source, source) &&
    Object.is(state.fallbackSource, fallbackSource);

  const usingFallback = isCurrentSource
    ? state.usingFallback
    : !hasImageSource(source) && hasImageSource(fallbackSource);

  const status: ImageStatus = isCurrentSource ? state.status : "loading";

  const activeSource = usingFallback ? fallbackSource : source;

  /**
   * Marks the currently rendered source as successfully loaded.
   */
  const markLoaded = useCallback(() => {
    setState({
      source,
      fallbackSource,
      usingFallback,
      status: "loaded",
    });
  }, [source, fallbackSource, usingFallback]);

  /**
   * Switches to the fallback source or marks the image as failed.
   */
  const markError = useCallback(() => {
    setState((current) => {
      const currentIsValid =
        Object.is(current.source, source) &&
        Object.is(current.fallbackSource, fallbackSource);

      const currentUsesFallback = currentIsValid
        ? current.usingFallback
        : !hasImageSource(source) && hasImageSource(fallbackSource);

      if (!currentUsesFallback && hasImageSource(fallbackSource)) {
        return {
          source,
          fallbackSource,
          usingFallback: true,
          status: "loading",
        };
      }

      return {
        source,
        fallbackSource,
        usingFallback: currentUsesFallback,
        status: "error",
      };
    });
  }, [source, fallbackSource]);

  return {
    activeSource,
    usingFallback,
    status,
    markLoaded,
    markError,
  };
};

export { useImageState };
export type { ImageStatus };
