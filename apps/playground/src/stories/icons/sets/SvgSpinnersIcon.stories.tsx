import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { SvgSpinnersIcon } from "@puzzle/icons/sets/svg-spinners";
import { SvgSpinnersIconPage } from "@puzzle/icons/sets/svg-spinners.page";
import { ALL_SVG_SPINNERS_ICONS } from "@puzzle/icons/sets/svg-spinners.constants";

const meta = {
  title: "Icons/Sets/SvgSpinners",
  component: SvgSpinnersIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_SVG_SPINNERS_ICONS ],
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
} satisfies Meta<typeof SvgSpinnersIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "12-dots-scale-rotate",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <SvgSpinnersIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "12-dots-scale-rotate",
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
        <SvgSpinnersIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
