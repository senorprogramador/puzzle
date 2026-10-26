import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { LsiconIcon } from "@puzzle/icons/sets/lsicon";
import { LsiconIconPage } from "@puzzle/icons/sets/lsicon.page";
import { ALL_LSICON_ICONS } from "@puzzle/icons/sets/lsicon.constants";

const meta = {
  title: "Icons/Sets/Lsicon",
  component: LsiconIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_LSICON_ICONS ],
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
} satisfies Meta<typeof LsiconIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "add-chat-filled",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <LsiconIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "add-chat-filled",
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
        <LsiconIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
