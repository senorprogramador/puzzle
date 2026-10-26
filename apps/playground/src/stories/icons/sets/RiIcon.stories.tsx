import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { RiIcon } from "@puzzle/icons/sets/ri";
import { RiIconPage } from "@puzzle/icons/sets/ri.page";
import { ALL_RI_ICONS } from "@puzzle/icons/sets/ri.constants";

const meta = {
  title: "Icons/Sets/Ri",
  component: RiIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_RI_ICONS ],
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
} satisfies Meta<typeof RiIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "24-hours-fill",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <RiIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "24-hours-fill",
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
        <RiIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
