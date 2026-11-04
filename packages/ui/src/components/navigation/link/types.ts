import type { ComponentPropsWithRef } from "react";

type LinkProps = Omit<ComponentPropsWithRef<"a">, "href"> & {
  /** Destination of the link. */
  href: string;

  /**
   * Additional props forwarded to the configured Link component.
   *
   * Useful for router-specific props such as `params` or `search`.
   */
  componentProps?: Record<string, unknown>;
};

export type { LinkProps };
