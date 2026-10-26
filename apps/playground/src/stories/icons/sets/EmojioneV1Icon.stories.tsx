import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { EmojioneV1Icon } from "@puzzle/icons/sets/emojione-v1";
import { EmojioneV1IconPage } from "@puzzle/icons/sets/emojione-v1.page";
import { ALL_EMOJIONE_V1_ICONS } from "@puzzle/icons/sets/emojione-v1.constants";

const meta = {
  title: "Icons/Sets/EmojioneV1",
  component: EmojioneV1Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_EMOJIONE_V1_ICONS ],
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
} satisfies Meta<typeof EmojioneV1Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "a-button",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <EmojioneV1Icon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "a-button",
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
        <EmojioneV1IconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
