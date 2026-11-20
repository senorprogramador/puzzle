import "server-only";

import type { ResourceDescriptor } from "@puzzle-ui/core/rendering";

import type { SsrBoundaryProps } from "../ssr";
import { StaticBoundary } from "../static";
import { getResourcePreloadOptions } from "../resource-preload";
import type { StaticBoundaryProps } from "../static";

export type NextSsrBoundaryProps = SsrBoundaryProps;
export type NextStaticBoundaryProps = StaticBoundaryProps;

const renderResourceHint = (resource: ResourceDescriptor, index: number) => (
  <link
    key={`${resource.type}:${resource.url}:${index}`}
    rel="preload"
    href={resource.url}
    {...getResourcePreloadOptions(resource)}
  />
);

export const NextSsrBoundary = ({
  children,
  resources = [],
}: NextSsrBoundaryProps) => (
  <>
    {resources.map(renderResourceHint)}
    {children}
  </>
);

export {
  StaticBoundary as NextStaticBoundary,
};
