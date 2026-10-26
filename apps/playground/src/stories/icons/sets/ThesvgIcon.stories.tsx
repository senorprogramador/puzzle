import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ThesvgIcon } from "@puzzle/icons/sets/thesvg";
import { ThesvgIconPage } from "@puzzle/icons/sets/thesvg.page";
import { ALL_THESVG_ICONS } from "@puzzle/icons/sets/thesvg.constants";

const meta = {
  title: "Icons/Sets/Thesvg",
  component: ThesvgIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_THESVG_ICONS ],
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
} satisfies Meta<typeof ThesvgIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "42",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <ThesvgIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "42",
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
        <ThesvgIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
