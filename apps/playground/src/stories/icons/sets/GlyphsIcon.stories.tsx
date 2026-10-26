import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { GlyphsIcon } from "@puzzle/icons/sets/glyphs";
import { GlyphsIconPage } from "@puzzle/icons/sets/glyphs.page";
import { ALL_GLYPHS_ICONS } from "@puzzle/icons/sets/glyphs.constants";

const meta = {
  title: "Icons/Sets/Glyphs",
  component: GlyphsIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_GLYPHS_ICONS ],
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
} satisfies Meta<typeof GlyphsIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "a",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <GlyphsIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "a",
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
        <GlyphsIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
