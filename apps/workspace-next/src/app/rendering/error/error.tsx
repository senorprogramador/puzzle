"use client";

import { useEffect } from "react";

type RenderingErrorProps = Readonly<{
  error: Error & { digest?: string };
  retry: () => void;
}>;

const RenderingError = ({ error, retry }: RenderingErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <p role="alert" data-testid="next-route-error">
        The rendering route failed as expected.
      </p>
      <button type="button" onClick={retry}>
        Retry rendering route
      </button>
    </main>
  );
};

export default RenderingError;
