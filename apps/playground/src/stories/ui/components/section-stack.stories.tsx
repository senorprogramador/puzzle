import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionStack as UISectionStack, Section } from "@puzzle/ui";

const meta = {
  title: "UI/Components/SectionStack",
  component: UISectionStack,
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
} satisfies Meta<typeof UISectionStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const SectionWithContent = (props: React.ComponentProps<typeof Section>) => (
  <Section {...props}>
    <h1>SectionStack</h1>
    <p>
      The SectionStack component groups multiple Section components and
      automatically manages the spacing between them based on their themes. It
      creates a consistent vertical layout while reducing unnecessary whitespace
      between sections that share the same visual style.
    </p>
    <p>Features:</p>
    <ul>
      <li>
        Automatic spacing adjustment: When two adjacent sections use the same
        theme, the padding at their shared boundary is halved.
      </li>
      <li>
        Theme-aware layout: Sections with different themes retain their normal
        vertical padding, preserving clear visual separation between content
        areas.
      </li>
      <li>
        Consistent vertical layout: Sections are arranged in a single column,
        creating a predictable page structure.
      </li>
      <li>
        Dynamic updates: Spacing is recalculated when sections are added,
        removed, or reordered through React rendering.
      </li>
      <li>
        Custom styling: Use className to apply additional styles to the stack
        wrapper.
      </li>
    </ul>
  </Section>
);

export const SectionStack: Story = {
  args: { children: <></> },
  render: (args) => (
    <UISectionStack>
      <SectionWithContent theme="default" />
      <SectionWithContent theme="default" />
      <SectionWithContent theme="default" />
      <SectionWithContent theme="secondary" />
      <SectionWithContent theme="default" />
      <SectionWithContent theme="default" />
      <SectionWithContent theme="accent" />
      <SectionWithContent theme="default" />
      <SectionWithContent theme="dark" />
    </UISectionStack>
  ),
};
