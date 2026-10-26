import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { NimbusIcon } from "@puzzle/icons/sets/nimbus";
import { NimbusIconPage } from "@puzzle/icons/sets/nimbus.page";
import { ALL_NIMBUS_ICONS } from "@puzzle/icons/sets/nimbus.constants";

const meta = {
  title: "Icons/Sets/Nimbus",
  component: NimbusIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_NIMBUS_ICONS ],
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
} satisfies Meta<typeof NimbusIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "accordion",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <NimbusIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "accordion",
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
        <NimbusIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
