import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { EnergyIconsIcon } from "@puzzle/icons/sets/energy-icons";
import { EnergyIconsIconPage } from "@puzzle/icons/sets/energy-icons.page";
import { ALL_ENERGY_ICONS_ICONS } from "@puzzle/icons/sets/energy-icons.constants";

const meta = {
  title: "Icons/Sets/EnergyIcons",
  component: EnergyIconsIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_ENERGY_ICONS_ICONS ],
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
} satisfies Meta<typeof EnergyIconsIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "a-frame-20",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <EnergyIconsIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "a-frame-20",
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
        <EnergyIconsIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
