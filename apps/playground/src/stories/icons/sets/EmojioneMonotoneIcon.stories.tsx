import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { EmojioneMonotoneIcon } from "@puzzle/icons/sets/emojione-monotone";
import { EmojioneMonotoneIconPage } from "@puzzle/icons/sets/emojione-monotone.page";
import { ALL_EMOJIONE_MONOTONE_ICONS } from "@puzzle/icons/sets/emojione-monotone.constants";

const meta = {
  title: "Icons/Sets/EmojioneMonotone",
  component: EmojioneMonotoneIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_EMOJIONE_MONOTONE_ICONS ],
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
} satisfies Meta<typeof EmojioneMonotoneIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "1st-place-medal",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <EmojioneMonotoneIcon {...args} />,
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
        <EmojioneMonotoneIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
