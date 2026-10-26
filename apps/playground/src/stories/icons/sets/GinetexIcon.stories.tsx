import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { GinetexIcon } from "@puzzle/icons/sets/ginetex";
import { GinetexIconPage } from "@puzzle/icons/sets/ginetex.page";
import { ALL_GINETEX_ICONS } from "@puzzle/icons/sets/ginetex.constants";

const meta = {
  title: "Icons/Sets/Ginetex",
  component: GinetexIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_GINETEX_ICONS ],
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
} satisfies Meta<typeof GinetexIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "30c-fine-wash",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <GinetexIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "30c-fine-wash",
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
        <GinetexIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
