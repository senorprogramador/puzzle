"use client";

import type { ComponentProps } from "react";
import { Link } from "@tanstack/react-router";

type TanStackLinkProps = ComponentProps<typeof Link>;

// TanStack marks ancestor routes as current by default; Puzzle links should
// only receive aria-current="page" for the exact route.
const TanStackLink = ({ activeOptions, ...props }: TanStackLinkProps) => (
  <Link activeOptions={{ exact: true, ...activeOptions }} {...props} />
);

export { TanStackLink };
