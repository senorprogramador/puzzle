import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { F7Icon } from "@puzzle/icons/sets/f7";
import { F7IconPage } from "@puzzle/icons/sets/f7.page";
import { ALL_F7_ICONS } from "@puzzle/icons/sets/f7.constants";

const meta = {
  title: "Icons/Sets/F7",
  component: F7Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_F7_ICONS ],
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
} satisfies Meta<typeof F7Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "airplane",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <F7Icon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "airplane",
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
        <F7IconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
