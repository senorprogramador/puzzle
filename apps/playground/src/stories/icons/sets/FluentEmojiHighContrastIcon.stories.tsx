import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { FluentEmojiHighContrastIcon } from "@puzzle/icons/sets/fluent-emoji-high-contrast";
import { FluentEmojiHighContrastIconPage } from "@puzzle/icons/sets/fluent-emoji-high-contrast.page";
import { ALL_FLUENT_EMOJI_HIGH_CONTRAST_ICONS } from "@puzzle/icons/sets/fluent-emoji-high-contrast.constants";

const meta = {
  title: "Icons/Sets/FluentEmojiHighContrast",
  component: FluentEmojiHighContrastIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_FLUENT_EMOJI_HIGH_CONTRAST_ICONS ],
      control: {
        type: "select",
      },
    },
    size: { control: { type: "range", min: 32, max: 100, step: 1 } },
    color: { control: { type: "color" } },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof FluentEmojiHighContrastIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "1st-place-medal",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <FluentEmojiHighContrastIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "1st-place-medal",
    size: 32,
    color: "#302f41",
  },
  render: (args) => {
    const [filter, setFilter] = useState("");
    return (
      <div style={{ width: "600px", maxWidth: "80vw", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <input
          type="text"
          placeholder="Search icons..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginBottom: "16px", padding: "8px", fontSize: "16px" }}
        />
        <FluentEmojiHighContrastIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
