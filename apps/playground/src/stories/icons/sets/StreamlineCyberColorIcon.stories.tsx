import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { StreamlineCyberColorIcon } from "@puzzle/icons/sets/streamline-cyber-color";
import { StreamlineCyberColorIconPage } from "@puzzle/icons/sets/streamline-cyber-color.page";
import { ALL_STREAMLINE_CYBER_COLOR_ICONS } from "@puzzle/icons/sets/streamline-cyber-color.constants";

const meta = {
  title: "Icons/Sets/StreamlineCyberColor",
  component: StreamlineCyberColorIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_STREAMLINE_CYBER_COLOR_ICONS ],
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
} satisfies Meta<typeof StreamlineCyberColorIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "3d-glasses",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <StreamlineCyberColorIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "3d-glasses",
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
        <StreamlineCyberColorIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
