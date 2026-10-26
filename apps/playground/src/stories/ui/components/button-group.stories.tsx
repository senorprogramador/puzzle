import type { PropsWithChildren } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import { Button, ButtonGroup } from "@puzzle/ui";

const meta = {
  title: "UI/Components/Button Group",
  component: ButtonGroup,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  argTypes: {
    exclusive: { control: "boolean" },
  },
  args: {
    onClick: fn(),
    exclusive: false,
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const Container = ({ children }: PropsWithChildren) => (
  <div
    style={{
      width: "512px",
      height: "256px",
      padding: "16px",
      border: "1px solid #ccc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

export const Row: Story = {
  args: {
    variant: "toggle",
    direction: "row",
  },
  render: (args) => (
    <Container>
      <ButtonGroup {...args}>
        <Button>Primary</Button>
        <Button>Primary</Button>
        <Button>Primary</Button>
      </ButtonGroup>
    </Container>
  ),
};

export const Column: Story = {
  args: {
    variant: "toggle",
    direction: "column",
  },
  render: (args) => (
    <Container>
      <ButtonGroup {...args}>
        <Button>Primary</Button>
        <Button>Primary</Button>
        <Button>Primary</Button>
      </ButtonGroup>
    </Container>
  ),
};
