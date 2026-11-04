"use client";

import { createContext, useContext, type PropsWithChildren } from "react";
import type { ThemeComponents } from "./components.types";

const ThemeComponentsContext = createContext<ThemeComponents | undefined>(
  undefined,
);

type ThemeComponentsProviderProps = PropsWithChildren<{
  components: ThemeComponents;
}>;

const ThemeComponentsProvider = ({
  components,
  children,
}: ThemeComponentsProviderProps) => {
  return (
    <ThemeComponentsContext.Provider value={components}>
      {children}
    </ThemeComponentsContext.Provider>
  );
};

const useThemeComponents = () => {
  return useContext(ThemeComponentsContext);
};

export { ThemeComponentsProvider, useThemeComponents };
