import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Fa6SolidIcon } from "@puzzle/icons/sets/fa6-solid";
import { Fa6SolidIconPage } from "@puzzle/icons/sets/fa6-solid.page";
import { ALL_FA6_SOLID_ICONS } from "@puzzle/icons/sets/fa6-solid.constants";

const meta = {
  title: "Icons/Sets/Fa6Solid",
  component: Fa6SolidIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_FA6_SOLID_ICONS ],
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
} satisfies Meta<typeof Fa6SolidIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "0",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <Fa6SolidIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "0",
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
        <Fa6SolidIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
