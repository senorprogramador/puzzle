import type { Meta, StoryObj } from "@storybook/react-vite";
import { Theme } from "@puzzle/theme";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Theme/Fonts/GoogleFont",
  component: Theme,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  //argTypes: {
  //  backgroundColor: { control: "color" },
  //},
  //args: { onClick: fn() },
} satisfies Meta<typeof Theme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemeFonts: Story = {
  args: {
    fonts: {
      heading: {
        family: "Play",
        weights: [400, 700],
        styles: ["normal"],
        display: "swap",
      },
      body: {
        family: "Open Sans",
        weights: [400, 700],
        styles: ["normal"],
        display: "swap",
      },
    },
  },
  render: ({ fonts }) => (
    <Theme fonts={fonts}>
      <h1>The quick brown fox jumps over the lazy dog</h1>
      <h2>The quick brown fox jumps over the lazy dog</h2>
      <h3>The quick brown fox jumps over the lazy dog</h3>
      <h4>The quick brown fox jumps over the lazy dog</h4>
      <p>
        The quick brown fox jumps over the lazy dog
        <br />
        The quick brown fox jumps over the lazy dog
      </p>
      <p>The quick brown fox jumps over the lazy dog</p>
    </Theme>
  ),
};
