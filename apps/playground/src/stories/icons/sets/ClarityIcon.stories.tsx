import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ClarityIcon } from "@puzzle/icons/sets/clarity";
import { ClarityIconPage } from "@puzzle/icons/sets/clarity.page";
import { ALL_CLARITY_ICONS } from "@puzzle/icons/sets/clarity.constants";

const meta = {
  title: "Icons/Sets/Clarity",
  component: ClarityIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_CLARITY_ICONS ],
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
} satisfies Meta<typeof ClarityIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "accessibility-1-line",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <ClarityIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "accessibility-1-line",
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
        <ClarityIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
