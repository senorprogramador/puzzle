import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Fa7BrandsIcon } from "@puzzle/icons/sets/fa7-brands";
import { Fa7BrandsIconPage } from "@puzzle/icons/sets/fa7-brands.page";
import { ALL_FA7_BRANDS_ICONS } from "@puzzle/icons/sets/fa7-brands.constants";

const meta = {
  title: "Icons/Sets/Fa7Brands",
  component: Fa7BrandsIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_FA7_BRANDS_ICONS ],
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
} satisfies Meta<typeof Fa7BrandsIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "11ty",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <Fa7BrandsIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "11ty",
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
        <Fa7BrandsIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
