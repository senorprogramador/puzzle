import type { PropsWithChildren } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import {
  Button,
  Backdrop,
  CircularProgress,
  PortalTarget,
  Portal,
} from "@puzzle/ui";

const meta = {
  title: "UI/Components/Backdrop",
  component: Backdrop,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  argTypes: {
    open: { control: "boolean" },
  },
  args: {
    onClick: fn(),
    open: false,
  },
} satisfies Meta<typeof Backdrop>;

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

export const Default: Story = {
  args: {
    open: false,
    onClick: fn(),
  },
  render: (args) => {
    const { open: initiallyOpen, onClick } = args;
    const [open, setOpen] = useState(initiallyOpen);

    return (
      <>
        <Container>
          <Button onClick={() => setOpen(true)}>Show backdrop</Button>
          <Portal targetId="backdrop-portal">
            <Backdrop
              open={open}
              onClick={() => {
                setOpen(false);
                onClick?.();
              }}
            >
              <CircularProgress color="white" />
            </Backdrop>
          </Portal>
        </Container>
        <PortalTarget id="backdrop-portal" />
      </>
    );
  },
};
