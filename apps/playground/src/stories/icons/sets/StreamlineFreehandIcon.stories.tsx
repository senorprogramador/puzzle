import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { StreamlineFreehandIcon } from "@puzzle/icons/sets/streamline-freehand";
import { StreamlineFreehandIconPage } from "@puzzle/icons/sets/streamline-freehand.page";
import { ALL_STREAMLINE_FREEHAND_ICONS } from "@puzzle/icons/sets/streamline-freehand.constants";

const meta = {
  title: "Icons/Sets/StreamlineFreehand",
  component: StreamlineFreehandIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_STREAMLINE_FREEHAND_ICONS ],
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
} satisfies Meta<typeof StreamlineFreehandIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "accessories-remote-shutter",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <StreamlineFreehandIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "accessories-remote-shutter",
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
        <StreamlineFreehandIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
