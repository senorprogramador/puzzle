import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { LaIcon } from "@puzzle/icons/sets/la";
import { LaIconPage } from "@puzzle/icons/sets/la.page";
import { ALL_LA_ICONS } from "@puzzle/icons/sets/la.constants";

const meta = {
  title: "Icons/Sets/La",
  component: LaIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_LA_ICONS ],
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
} satisfies Meta<typeof LaIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "500px",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <LaIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "500px",
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
        <LaIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
