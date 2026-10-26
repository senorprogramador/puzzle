import { useState, type PropsWithChildren } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import { Button } from "@puzzle/ui";

const meta = {
  title: "UI/Components/Button",
  component: Button,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

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

export const Primary: Story = {
  args: {
    children: "Primary button",
    variant: "primary",
  },
  render: (args) => (
    <Container>
      <Button {...args} />
    </Container>
  ),
};

export const Secondary: Story = {
  args: {
    children: "Secondary button",
    variant: "secondary",
  },
  render: (args) => (
    <Container>
      <Button {...args} />
    </Container>
  ),
};

export const Danger: Story = {
  args: {
    children: "Danger button",
    variant: "danger",
  },
  render: (args) => (
    <Container>
      <Button {...args} />
    </Container>
  ),
};

export const Ghost: Story = {
  args: {
    children: "Ghost button",
    variant: "ghost",
  },
  render: (args) => (
    <Container>
      <Button {...args} />
    </Container>
  ),
};

export const Outline: Story = {
  args: {
    children: "Outline button",
    variant: "outline",
  },
  render: (args) => (
    <Container>
      <Button {...args} />
    </Container>
  ),
};

export const StyledAsLink: Story = {
  args: {
    children: "Link",
    href: "https://senorprogramador.com",
    as: "a",
    target: "_blank",
    variant: "link",
  },
  render: (args) => (
    <Container>
      <Button {...args} />
    </Container>
  ),
};

export const ButtonAsLink: Story = {
  args: {
    children: "Link",
    href: "https://senorprogramador.com",
    as: "a",
    target: "_blank",
  },
  render: (args) => (
    <Container>
      <Button {...args} />
    </Container>
  ),
};

export const Toggle: Story = {
  args: {
    children: "Toggle",
    variant: "toggle",
  },
  render: (args) => {
    const [active, setActive] = useState(false);
    return (
      <Container>
        <Button
          {...args}
          variant={active ? "toggle-active" : "toggle"}
          onClick={() => setActive(!active)}
          aria-pressed={active}
        />
      </Container>
    );
  },
};

export const FormSubmit: Story = {
  args: {
    children: "Submit",
    type: "submit",
  },
  render: (args) => (
    <Container>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Form submitted!");
        }}
      >
        <Button {...args} />
      </form>
    </Container>
  ),
};

export const FullWidth: Story = {
  args: {
    children: "Full width button",
    fullWidth: true,
  },
  render: (args) => (
    <Container>
      <Button {...args} />
    </Container>
  ),
};

export const Loading: Story = {
  args: {
    children: "Loading",
    loading: true,
  },
  render: (args) => (
    <Container>
      <Button {...args} />
    </Container>
  ),
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
  render: (args) => (
    <Container>
      <Button {...args} />
    </Container>
  ),
};
