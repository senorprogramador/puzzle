"use client";

import { useEffect, useState, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type PortalProps = PropsWithChildren<{
  /**
   * ID of an existing portal target.
   * Falls back to the provided container or document.body.
   */
  targetId?: string;

  /**
   * Explicit portal target.
   * Useful for iframe documents and custom overlay roots.
   */
  container?: HTMLElement | null;
}>;

const Portal = ({ targetId, container, children }: PortalProps) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (container) {
      setTarget(container);
      return;
    }

    const nextTarget = targetId
      ? (document.getElementById(targetId) ?? document.body)
      : document.body;

    setTarget(nextTarget);
  }, [targetId, container]);

  if (!target || children == null) {
    return null;
  }

  return createPortal(children, target);
};

export { Portal, type PortalProps };
