"use client";

import { useEffect, useState, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

import { useThemeScope } from "@puzzle-ui/theme/scope-context";

type PortalProps = PropsWithChildren<{
  /**
   * ID of an existing portal target.
   * Falls back to document.body when the target does not exist.
   */
  targetId?: string;

  /**
   * Explicit portal target.
   * Useful for iframe documents and custom overlay roots.
   */
  container?: HTMLElement | null;
}>;

const Portal = ({ targetId, container, children }: PortalProps) => {
  const themeScope = useThemeScope();
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (container) {
      setTarget(container);
      return;
    }

    if (targetId) {
      setTarget(document.getElementById(targetId) ?? document.body);
      return;
    }

    if (themeScope) {
      setTarget(themeScope.portalTarget);
      return;
    }

    setTarget(document.body);
  }, [targetId, container, themeScope]);

  if (!target || children == null) {
    return null;
  }

  return createPortal(children, target);
};

export { Portal, type PortalProps };
