import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { NotoV1Icon } from "@puzzle/icons/sets/noto-v1";
import { NotoV1IconPage } from "@puzzle/icons/sets/noto-v1.page";
import { ALL_NOTO_V1_ICONS } from "@puzzle/icons/sets/noto-v1.constants";

const meta = {
  title: "Icons/Sets/NotoV1",
  component: NotoV1Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_NOTO_V1_ICONS ],
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
} satisfies Meta<typeof NotoV1Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "1st-place-medal",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <NotoV1Icon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "1st-place-medal",
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
        <NotoV1IconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
