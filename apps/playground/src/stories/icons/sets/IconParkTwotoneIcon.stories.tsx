import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { IconParkTwotoneIcon } from "@puzzle/icons/sets/icon-park-twotone";
import { IconParkTwotoneIconPage } from "@puzzle/icons/sets/icon-park-twotone.page";
import { ALL_ICON_PARK_TWOTONE_ICONS } from "@puzzle/icons/sets/icon-park-twotone.constants";

const meta = {
  title: "Icons/Sets/IconParkTwotone",
  component: IconParkTwotoneIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_ICON_PARK_TWOTONE_ICONS ],
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
} satisfies Meta<typeof IconParkTwotoneIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "abnormal",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <IconParkTwotoneIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "abnormal",
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
        <IconParkTwotoneIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
