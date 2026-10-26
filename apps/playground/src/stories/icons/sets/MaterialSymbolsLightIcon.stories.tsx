import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { MaterialSymbolsLightIcon } from "@puzzle/icons/sets/material-symbols-light";
import { MaterialSymbolsLightIconPage } from "@puzzle/icons/sets/material-symbols-light.page";
import { ALL_MATERIAL_SYMBOLS_LIGHT_ICONS } from "@puzzle/icons/sets/material-symbols-light.constants";

const meta = {
  title: "Icons/Sets/MaterialSymbolsLight",
  component: MaterialSymbolsLightIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_MATERIAL_SYMBOLS_LIGHT_ICONS ],
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
} satisfies Meta<typeof MaterialSymbolsLightIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "123",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <MaterialSymbolsLightIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "123",
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
        <MaterialSymbolsLightIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
