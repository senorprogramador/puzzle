import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { FileIconsIcon } from "@puzzle/icons/sets/file-icons";
import { FileIconsIconPage } from "@puzzle/icons/sets/file-icons.page";
import { ALL_FILE_ICONS_ICONS } from "@puzzle/icons/sets/file-icons.constants";

const meta = {
  title: "Icons/Sets/FileIcons",
  component: FileIconsIcon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      options: [ ...ALL_FILE_ICONS_ICONS ],
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
} satisfies Meta<typeof FileIconsIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "1c",
    size: 64,
    color: "#302f41",
  },
    render: (args) => <FileIconsIcon {...args} />,
};

export const AllIcons: Story = {
  args: {
    name: "1c",
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
        <FileIconsIconIconPage filter={filter} size={args.size} color={args.color} />
      </div>
    );
  },
}
