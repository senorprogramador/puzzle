import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { SiIcon } from "@puzzle/icons/sets/si";
import { SiIconPage } from "@puzzle/icons/sets/si.page";
import { ALL_SI_ICONS } from "@puzzle/icons/sets/si.constants";

const meta = {
  title: "Icons/Sets/Si",
  component: SiIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_SI_ICONS ],
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
} satisfies Meta<typeof SiIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "actions-duotone",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <SiIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "actions-duotone",
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
        <SiIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
