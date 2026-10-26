import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { PiconIcon } from "@puzzle/icons/sets/picon";
import { PiconIconPage } from "@puzzle/icons/sets/picon.page";
import { ALL_PICON_ICONS } from "@puzzle/icons/sets/picon.constants";

const meta = {
  title: "Icons/Sets/Picon",
  component: PiconIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_PICON_ICONS ],
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
} satisfies Meta<typeof PiconIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "2g",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <PiconIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "2g",
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
        <PiconIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
