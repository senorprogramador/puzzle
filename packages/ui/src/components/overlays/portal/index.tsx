"use client";

import { useEffect, useState, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type PortalProps = PropsWithChildren<{
  /** ID of an existing portal target. Defaults to document.body. */
  targetId?: string;
}>;

const Portal = ({ targetId, children }: PortalProps) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const nextTarget = targetId
      ? (document.getElementById(targetId) ?? document.body)
      : document.body;

    setTarget(nextTarget);
  }, [targetId]);

  if (!target || children == null) {
    return null;
  }

  return createPortal(children, target);
};

export { Portal, type PortalProps };
