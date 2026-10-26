import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { StreamlineSharpColorIcon } from "@puzzle/icons/sets/streamline-sharp-color";
import { StreamlineSharpColorIconPage } from "@puzzle/icons/sets/streamline-sharp-color.page";
import { ALL_STREAMLINE_SHARP_COLOR_ICONS } from "@puzzle/icons/sets/streamline-sharp-color.constants";

const meta = {
  title: "Icons/Sets/StreamlineSharpColor",
  component: StreamlineSharpColorIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_STREAMLINE_SHARP_COLOR_ICONS ],
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
} satisfies Meta<typeof StreamlineSharpColorIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "3d-move",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <StreamlineSharpColorIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "3d-move",
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
        <StreamlineSharpColorIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
