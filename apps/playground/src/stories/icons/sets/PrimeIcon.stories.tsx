import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { PrimeIcon } from "@puzzle/icons/sets/prime";
import { PrimeIconPage } from "@puzzle/icons/sets/prime.page";
import { ALL_PRIME_ICONS } from "@puzzle/icons/sets/prime.constants";

const meta = {
  title: "Icons/Sets/Prime",
  component: PrimeIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_PRIME_ICONS ],
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
} satisfies Meta<typeof PrimeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "address-book",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <PrimeIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "address-book",
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
        <PrimeIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
