"use client";

import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type PortalProps = PropsWithChildren<{
  targetId?: string;
}>;

const Portal = ({ targetId, children }: PortalProps) => {
  return createPortal(
    children,
    targetId
      ? document.getElementById(targetId) || document.body
      : document.body,
  );
};

export { Portal, type PortalProps };
