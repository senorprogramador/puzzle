"use client";

import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type PortalProps = PropsWithChildren<{
  targetId?: string;
}>;

const Portal = ({ targetId, children }: PortalProps) => {
  if (typeof document === "undefined") {
    return children;
  }
  const target = targetId
    ? document.getElementById(targetId) || document.body
    : document.body;
  return children ? createPortal(children, target) : null;
};

export { Portal, type PortalProps };
