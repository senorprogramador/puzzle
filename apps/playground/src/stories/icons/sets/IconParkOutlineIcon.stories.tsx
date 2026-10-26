import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { IconParkOutlineIcon } from "@puzzle/icons/sets/icon-park-outline";
import { IconParkOutlineIconPage } from "@puzzle/icons/sets/icon-park-outline.page";
import { ALL_ICON_PARK_OUTLINE_ICONS } from "@puzzle/icons/sets/icon-park-outline.constants";

const meta = {
  title: "Icons/Sets/IconParkOutline",
  component: IconParkOutlineIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_ICON_PARK_OUTLINE_ICONS ],
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
} satisfies Meta<typeof IconParkOutlineIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "a-cane",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <IconParkOutlineIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "a-cane",
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
        <IconParkOutlineIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
