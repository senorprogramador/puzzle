import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { MaterialIconThemeIcon } from "@puzzle/icons/sets/material-icon-theme";
import { MaterialIconThemeIconPage } from "@puzzle/icons/sets/material-icon-theme.page";
import { ALL_MATERIAL_ICON_THEME_ICONS } from "@puzzle/icons/sets/material-icon-theme.constants";

const meta = {
  title: "Icons/Sets/MaterialIconTheme",
  component: MaterialIconThemeIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_MATERIAL_ICON_THEME_ICONS ],
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
} satisfies Meta<typeof MaterialIconThemeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "3d",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <MaterialIconThemeIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "3d",
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
        <MaterialIconThemeIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
