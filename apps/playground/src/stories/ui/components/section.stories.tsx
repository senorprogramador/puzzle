import type { Meta, StoryObj } from "@storybook/react-vite";

import { Section as UISection } from "@puzzle/ui";

const meta = {
  title: "UI/Components/Section",
  component: UISection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    controls: {
      fullWidth: {
        control: { type: "boolean" },
      },
      noPadding: {
        control: { type: "boolean" },
      },
      compactTop: {
        control: { type: "boolean" },
      },
      compactBottom: {
        control: { type: "boolean" },
      },
      theme: {
        options: ["default", "light", "dark", "primary", "secondary", "accent"],
        control: { type: "radio" },
      },
    },
  },
} satisfies Meta<typeof UISection>;

export default meta;
type Story = StoryObj<typeof meta>;

const Text = () => (
  <>
    <h1>Section</h1>
    <p>
      The Section component is a layout component designed to organize page
      content into distinct vertical sections. It provides consistent vertical
      spacing, optional content containment, and theme-based background and text
      colors.
    </p>
    <p>
      Features:
      <ul>
        <li>
          Vertical spacing: Sections have default vertical padding to create
          consistent spacing between content blocks.
        </li>
        <li>
          Theme support: Optionally specify a theme to control the section's
          background and text colors.
        </li>
        <li>
          Content container: By default, children are wrapped in a Container to
          constrain their width and center the content.
        </li>
        <li>
          Full-width content: Set fullWidth to true to render children directly
          without a Container wrapper.
        </li>
        <li>
          No padding: Set noPadding to true to remove the section's vertical
          padding.
        </li>
        <li>
          Automatic spacing adjustment: When adjacent sections share the same
          theme, the padding at their shared boundary is halved to create a more
          cohesive visual flow.
        </li>
      </ul>
    </p>
  </>
);

export const Default: Story = {
  args: {},
  render: (args) => (
    <UISection {...args}>
      <Text />
    </UISection>
  ),
};

export const Light: Story = {
  args: { theme: "light" },
  render: (args) => (
    <UISection {...args}>
      <Text />
    </UISection>
  ),
};

export const Dark: Story = {
  args: { theme: "dark" },
  render: (args) => (
    <UISection {...args}>
      <Text />
    </UISection>
  ),
};

export const Primary: Story = {
  args: { theme: "primary" },
  render: (args) => (
    <UISection {...args}>
      <Text />
    </UISection>
  ),
};

export const Secondary: Story = {
  args: { theme: "secondary" },
  render: (args) => (
    <UISection {...args}>
      <Text />
    </UISection>
  ),
};

export const Accent: Story = {
  args: { theme: "accent" },
  render: (args) => (
    <UISection {...args}>
      <Text />
    </UISection>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <UISection {...args}>
      <Text />
    </UISection>
  ),
};

export const NoPadding: Story = {
  args: { noPadding: true },
  render: (args) => (
    <UISection {...args}>
      <Text />
    </UISection>
  ),
};
