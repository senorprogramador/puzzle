import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { TeenyiconsIcon } from "@puzzle/icons/sets/teenyicons";
import { TeenyiconsIconPage } from "@puzzle/icons/sets/teenyicons.page";
import { ALL_TEENYICONS_ICONS } from "@puzzle/icons/sets/teenyicons.constants";

const meta = {
  title: "Icons/Sets/Teenyicons",
  component: TeenyiconsIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_TEENYICONS_ICONS ],
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
} satisfies Meta<typeof TeenyiconsIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "360-outline",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <TeenyiconsIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "360-outline",
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
        <TeenyiconsIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
