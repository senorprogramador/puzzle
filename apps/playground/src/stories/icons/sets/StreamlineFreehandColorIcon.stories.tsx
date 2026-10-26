import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { StreamlineFreehandColorIcon } from "@puzzle/icons/sets/streamline-freehand-color";
import { StreamlineFreehandColorIconPage } from "@puzzle/icons/sets/streamline-freehand-color.page";
import { ALL_STREAMLINE_FREEHAND_COLOR_ICONS } from "@puzzle/icons/sets/streamline-freehand-color.constants";

const meta = {
  title: "Icons/Sets/StreamlineFreehandColor",
  component: StreamlineFreehandColorIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_STREAMLINE_FREEHAND_COLOR_ICONS ],
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
} satisfies Meta<typeof StreamlineFreehandColorIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "accessories-remote-shutter",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <StreamlineFreehandColorIcon {...args} />,
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
        <StreamlineFreehandColorIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
