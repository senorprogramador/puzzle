import { type PropsWithChildren } from "react";
import type { ThemeComponents } from "./components.types";
type ThemeComponentsProviderProps = PropsWithChildren<{
    components: ThemeComponents;
}>;
declare const ThemeComponentsProvider: ({ components, children, }: ThemeComponentsProviderProps) => import("react").JSX.Element;
declare const useThemeComponents: () => ThemeComponents | undefined;
export { ThemeComponentsProvider, useThemeComponents };
