import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { TopcoatIcon } from "@puzzle/icons/sets/topcoat";
import { TopcoatIconPage } from "@puzzle/icons/sets/topcoat.page";
import { ALL_TOPCOAT_ICONS } from "@puzzle/icons/sets/topcoat.constants";

const meta = {
  title: "Icons/Sets/Topcoat",
  component: TopcoatIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_TOPCOAT_ICONS ],
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
} satisfies Meta<typeof TopcoatIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "alert",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <TopcoatIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "alert",
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
        <TopcoatIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
