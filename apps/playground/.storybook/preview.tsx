import type { Preview } from "@storybook/react-vite";
import { Theme } from "@puzzle/theme";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story, context) => (
      <Theme theme="light">
        <Story {...context} />
      </Theme>
    ),
  ],
};

export default preview;
