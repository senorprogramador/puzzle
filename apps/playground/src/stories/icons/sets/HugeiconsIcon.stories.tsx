import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { HugeiconsIcon } from "@puzzle/icons/sets/hugeicons";
import { HugeiconsIconPage } from "@puzzle/icons/sets/hugeicons.page";
import { ALL_HUGEICONS_ICONS } from "@puzzle/icons/sets/hugeicons.constants";

const meta = {
  title: "Icons/Sets/Hugeicons",
  component: HugeiconsIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_HUGEICONS_ICONS ],
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
} satisfies Meta<typeof HugeiconsIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "1st-bracket",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <HugeiconsIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "1st-bracket",
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
        <HugeiconsIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
