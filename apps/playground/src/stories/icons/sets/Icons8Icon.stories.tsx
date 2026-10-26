import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Icons8Icon } from "@puzzle/icons/sets/icons8";
import { Icons8IconPage } from "@puzzle/icons/sets/icons8.page";
import { ALL_ICONS8_ICONS } from "@puzzle/icons/sets/icons8.constants";

const meta = {
  title: "Icons/Sets/Icons8",
  component: Icons8Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_ICONS8_ICONS ],
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
} satisfies Meta<typeof Icons8Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "add-shopping-cart",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <Icons8Icon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "add-shopping-cart",
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
        <Icons8IconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
