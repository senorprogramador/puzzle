import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { KeylineIconsIcon } from "@puzzle/icons/sets/keyline-icons";
import { KeylineIconsIconPage } from "@puzzle/icons/sets/keyline-icons.page";
import { ALL_KEYLINE_ICONS_ICONS } from "@puzzle/icons/sets/keyline-icons.constants";

const meta = {
  title: "Icons/Sets/KeylineIcons",
  component: KeylineIconsIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_KEYLINE_ICONS_ICONS ],
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
} satisfies Meta<typeof KeylineIconsIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "a-arrow-down",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <KeylineIconsIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "a-arrow-down",
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
        <KeylineIconsIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
