import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { IcomoonFreeIcon } from "@puzzle/icons/sets/icomoon-free";
import { IcomoonFreeIconPage } from "@puzzle/icons/sets/icomoon-free.page";
import { ALL_ICOMOON_FREE_ICONS } from "@puzzle/icons/sets/icomoon-free.constants";

const meta = {
  title: "Icons/Sets/IcomoonFree",
  component: IcomoonFreeIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_ICOMOON_FREE_ICONS ],
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
} satisfies Meta<typeof IcomoonFreeIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "500px",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <IcomoonFreeIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "500px",
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
        <IcomoonFreeIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
