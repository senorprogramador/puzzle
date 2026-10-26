import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, Badge } from "@puzzle/ui";

const anchorOrigins = {
  topLeft: {
    horizontal: "left",
    vertical: "top",
  },
  topRight: {
    horizontal: "right",
    vertical: "top",
  },
  bottomRight: {
    horizontal: "right",
    vertical: "bottom",
  },
  bottomLeft: {
    horizontal: "left",
    vertical: "bottom",
  },
} as const;

const meta = {
  title: "UI/Components/Badge",
  component: Badge,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    content: { control: { type: "text" } },
    size: { control: { type: "range", min: 16, max: 36, step: 1 } },
    color: { control: { type: "color" } },
    anchorOrigin: {
      options: ["topLeft", "topRight", "bottomRight", "bottomLeft"],
      control: {
        type: "radio",
        labels: {
          topLeft: "Top left",
          topRight: "Top right",
          bottomRight: "Bottom right",
          bottomLeft: "Bottom left",
        },
        default: "topRight",
      },
      mapping: anchorOrigins,
    },
    anchorOverlap: {
      control: { type: "select", options: ["circular", "rectangular"] },
    },
    className: { control: false },
    children: { control: false },
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "1",
    anchorOrigin: { vertical: "top", horizontal: "right" },
    anchorOverlap: "circular",
  },
  render: (args) => (
    <Badge {...args}>
      <Avatar
        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=64&h=64&fit=crop&auto=format"
        alt="Señor Programador"
        size={64}
        shape={args.anchorOverlap === "circular" ? "circle" : "square"}
      />
    </Badge>
  ),
};
