import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import { Button, Container as UIContainer } from "@puzzle/ui";

const meta = {
  title: "UI/Components/Container",
  component: UIContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof UIContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Container: Story = {
  args: {},
  render: (args) => (
    <UIContainer {...args}>
      <Button fullWidth>Primary button</Button>
    </UIContainer>
  ),
};
