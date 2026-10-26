import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { RoentgenIcon } from "@puzzle/icons/sets/roentgen";
import { RoentgenIconPage } from "@puzzle/icons/sets/roentgen.page";
import { ALL_ROENTGEN_ICONS } from "@puzzle/icons/sets/roentgen.constants";

const meta = {
  title: "Icons/Sets/Roentgen",
  component: RoentgenIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_ROENTGEN_ICONS ],
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
} satisfies Meta<typeof RoentgenIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "acorn",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <RoentgenIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "acorn",
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
        <RoentgenIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
