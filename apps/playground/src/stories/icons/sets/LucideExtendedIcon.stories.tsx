import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { LucideExtendedIcon } from "@puzzle/icons/sets/lucide-extended";
import { LucideExtendedIconPage } from "@puzzle/icons/sets/lucide-extended.page";
import { ALL_LUCIDE_EXTENDED_ICONS } from "@puzzle/icons/sets/lucide-extended.constants";

const meta = {
  title: "Icons/Sets/LucideExtended",
  component: LucideExtendedIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_LUCIDE_EXTENDED_ICONS ],
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
} satisfies Meta<typeof LucideExtendedIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "ad-duotone",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <LucideExtendedIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "ad-duotone",
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
        <LucideExtendedIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
