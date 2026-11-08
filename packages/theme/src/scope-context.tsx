"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import type { ThemeMode } from "./types";

type ThemeScopeContextValue = {
  scopeId: string;
  theme: ThemeMode;
  portalTarget: HTMLDivElement | null;
};

type ThemeScopePortalState = {
  scopeId: string;
  theme: ThemeMode;
  element: HTMLDivElement;
};

type ThemeScopeProviderProps = PropsWithChildren<{
  scopeId: string | null;
  theme: ThemeMode;
}>;

const ThemeScopeContext = createContext<ThemeScopeContextValue | null>(null);

const ThemeScopeProvider = ({
  scopeId,
  theme,
  children,
}: ThemeScopeProviderProps) => {
  const scopeElementRef = useRef<HTMLDivElement>(null);
  const [portalState, setPortalState] = useState<ThemeScopePortalState | null>(
    null,
  );

  useEffect(() => {
    if (scopeId === null) {
      return;
    }

    const ownerDocument = scopeElementRef.current?.ownerDocument;

    if (!ownerDocument?.body) {
      return;
    }

    const portalTarget = ownerDocument.createElement("div");

    portalTarget.className = "puzzle-theme-scope puzzle-theme-scope--portal";
    portalTarget.dataset.puzzleThemeScope = scopeId;
    portalTarget.dataset.theme = theme;
    portalTarget.dataset.puzzleThemePortal = "true";

    ownerDocument.body.append(portalTarget);

    setPortalState({
      scopeId,
      theme,
      element: portalTarget,
    });

    return () => {
      portalTarget.remove();
    };
  }, [scopeId, theme]);

  const portalTarget =
    scopeId !== null &&
    portalState?.scopeId === scopeId &&
    portalState.theme === theme
      ? portalState.element
      : null;

  const value = useMemo<ThemeScopeContextValue | null>(() => {
    return scopeId === null
      ? null
      : {
          scopeId,
          theme,
          portalTarget,
        };
  }, [scopeId, theme, portalTarget]);

  return (
    <ThemeScopeContext.Provider value={value}>
      {scopeId === null ? (
        children
      ) : (
        <div
          ref={scopeElementRef}
          className="puzzle-theme-scope"
          data-puzzle-theme-scope={scopeId}
          data-theme={theme}
        >
          {children}
        </div>
      )}
    </ThemeScopeContext.Provider>
  );
};

const useThemeScope = () => {
  return useContext(ThemeScopeContext);
};

export { ThemeScopeProvider, useThemeScope, type ThemeScopeContextValue };
