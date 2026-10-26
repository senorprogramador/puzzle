import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar } from "@puzzle/ui";

const meta = {
  title: "UI/Components/Avatar",
  component: Avatar,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    src: { control: { type: "text" } },
    alt: { control: { type: "text" } },
    size: { control: { type: "range", min: 32, max: 100, step: 1 } },
    shape: { control: { type: "radio", options: ["circle", "square"] } },
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=100&w=100&h=100&fit=crop&auto=format",
    alt: "Señor Programador",
    size: 100,
    shape: "circle",
  },
  render: (args) => <Avatar {...args} />,
};

export const Initials: Story = {
  args: {
    alt: "Señor Programador",
    size: 100,
    shape: "circle",
  },
  render: (args) => <Avatar {...args} />,
};
