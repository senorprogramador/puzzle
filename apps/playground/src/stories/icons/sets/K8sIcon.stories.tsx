import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { K8sIcon } from "@puzzle/icons/sets/k8s";
import { K8sIconPage } from "@puzzle/icons/sets/k8s.page";
import { ALL_K8S_ICONS } from "@puzzle/icons/sets/k8s.constants";

const meta = {
  title: "Icons/Sets/K8s",
  component: K8sIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_K8S_ICONS ],
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
} satisfies Meta<typeof K8sIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "api-server",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <K8sIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "api-server",
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
        <K8sIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
