import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { WebsymbolIcon } from "@puzzle/icons/sets/websymbol";
import { WebsymbolIconPage } from "@puzzle/icons/sets/websymbol.page";
import { ALL_WEBSYMBOL_ICONS } from "@puzzle/icons/sets/websymbol.constants";

const meta = {
  title: "Icons/Sets/Websymbol",
  component: WebsymbolIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_WEBSYMBOL_ICONS ],
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
} satisfies Meta<typeof WebsymbolIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "archive",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <WebsymbolIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "archive",
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
        <WebsymbolIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
