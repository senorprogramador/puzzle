import { preload } from "react-dom";
import type { ReactNode } from "react";

import type { ResourceDescriptor } from "@puzzle-ui/core/rendering";
import { getResourcePreloadOptions } from "./resource-preload";

export type SsrBoundaryProps = Readonly<{
  children: ReactNode;
  resources?: readonly ResourceDescriptor[];
}>;

const preloadResource = (resource: ResourceDescriptor) => {
  preload(resource.url, getResourcePreloadOptions(resource));
};

export const SsrBoundary = ({
  children,
  resources = [],
}: SsrBoundaryProps) => {
  resources.forEach(preloadResource);
  return children;
};
