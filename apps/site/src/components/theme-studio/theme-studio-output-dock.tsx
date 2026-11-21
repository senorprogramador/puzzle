import type { ThemeStudioState } from "./theme-studio-model";
import {
  createPuzzleFontsJson,
  createThemeImplementation,
} from "./theme-studio-model";
import { ThemeStudioCodePanel } from "./code-panel";

type ThemeStudioOutputDockProps = {
  state: ThemeStudioState;
};

const ThemeStudioOutputDock = ({ state }: ThemeStudioOutputDockProps) => (
  <section className="theme-studio-output-dock" aria-label="Generated configuration">
    <ThemeStudioCodePanel
      title="Theme implementation"
      description="Copy the Theme provider setup for your app."
      code={createThemeImplementation(state)}
      language="tsx"
    />
    <ThemeStudioCodePanel
      title="puzzle-fonts.json"
      description="Use this with the Puzzle Theme font CLI."
      code={createPuzzleFontsJson(state)}
      language="json"
    />
  </section>
);

export { ThemeStudioOutputDock, type ThemeStudioOutputDockProps };
