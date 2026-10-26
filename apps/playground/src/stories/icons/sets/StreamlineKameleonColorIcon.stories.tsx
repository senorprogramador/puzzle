import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { StreamlineKameleonColorIcon } from "@puzzle/icons/sets/streamline-kameleon-color";
import { StreamlineKameleonColorIconPage } from "@puzzle/icons/sets/streamline-kameleon-color.page";
import { ALL_STREAMLINE_KAMELEON_COLOR_ICONS } from "@puzzle/icons/sets/streamline-kameleon-color.constants";

const meta = {
  title: "Icons/Sets/StreamlineKameleonColor",
  component: StreamlineKameleonColorIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_STREAMLINE_KAMELEON_COLOR_ICONS ],
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
} satisfies Meta<typeof StreamlineKameleonColorIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "aid-kit",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <StreamlineKameleonColorIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "aid-kit",
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
        <StreamlineKameleonColorIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
