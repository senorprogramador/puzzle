import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Preview, Section } from "@puzzle/ui";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

const variants = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "danger",
  "link",
] as const;

const sizes = ["xs", "sm", "md", "lg"] as const;

const variantCode = `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>
<Button variant="link">Learn more</Button>`;

const sizeCode = `<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Settings">
  <SettingsIcon />
</Button>`;

const linkCode = `<Button as="a" href="/docs">
  Documentation
</Button>

<Button as="a" href="https://example.com" target="_blank" rel="noopener noreferrer">
  External link
</Button>`;

const loadingCode = `<Button loading>Saving...</Button>
<Button disabled>Unavailable</Button>`;

const iconCode = `<Button leading={<SaveIcon />}>
  Save changes
</Button>

<Button trailing={<ArrowRightIcon />}>
  Continue
</Button>`;

function ToggleExample() {
  const [active, setActive] = useState(false);

  return (
    <Button
      variant={active ? "toggle-active" : "toggle"}
      aria-pressed={active}
      onClick={() => setActive((value) => !value)}
    >
      {active ? "Enabled" : "Disabled"}
    </Button>
  );
}

function RouteComponent() {
  return (
    <div className="space-y-12">
      <Section>
        <div className="space-y-4">
          <p className="text-sm font-semibold text-[var(--puzzle-color-primary)]">
            Actions
          </p>
          <h1 className="text-4xl font-bold">Button</h1>
          <p className="max-w-3xl text-lg text-[var(--puzzle-color-text-muted)]">
            Buttons allow users to trigger actions, submit forms, navigate
            between pages, and interact with your application.
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Import</h2>
          <pre className="overflow-x-auto rounded-lg bg-[var(--puzzle-color-surface-sunken)] p-4 text-sm">
            <code>{`import { Button } from "@puzzle/ui";`}</code>
          </pre>
          <p>
            Button is available as a named export from the Puzzle UI package.
            The <code>ButtonProps</code>, <code>ButtonVariant</code>, and{" "}
            <code>ButtonSize</code> types are also exported.
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Variants</h2>
          <p>
            Use the <code>variant</code> property to communicate the purpose and
            visual importance of an action.
          </p>

          <Preview code={variantCode}>
            <div className="flex flex-wrap items-center gap-3">
              {variants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant === "danger"
                    ? "Delete"
                    : variant === "link"
                      ? "Learn more"
                      : variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              ))}
            </div>
          </Preview>

          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>primary</strong> – The main action. Use sparingly for the
              most important action in a context.
            </li>
            <li>
              <strong>secondary</strong> – A less prominent alternative action.
            </li>
            <li>
              <strong>outline</strong> – A bordered action with a transparent
              background.
            </li>
            <li>
              <strong>ghost</strong> – A subtle action without a visible border.
            </li>
            <li>
              <strong>danger</strong> – An action that performs a potentially
              destructive operation.
            </li>
            <li>
              <strong>link</strong> – An action styled like a text link.
            </li>
          </ul>
        </div>
      </Section>

      <Section>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Sizes</h2>
          <p>
            The <code>size</code> property controls the dimensions and
            typography of the button.
          </p>

          <Preview code={sizeCode}>
            <div className="flex flex-wrap items-center gap-3">
              {sizes.map((size) => (
                <Button key={size} size={size}>
                  {size.toUpperCase()}
                </Button>
              ))}
              <Button size="icon" aria-label="Settings">
                ⚙
              </Button>
            </div>
          </Preview>

          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>xs</strong> – Extra small, for compact interfaces.
            </li>
            <li>
              <strong>sm</strong> – Small, for secondary or dense layouts.
            </li>
            <li>
              <strong>md</strong> – Medium, the default size.
            </li>
            <li>
              <strong>lg</strong> – Large, for prominent actions.
            </li>
            <li>
              <strong>icon</strong> – Square button intended for icons.
            </li>
          </ul>

          <p>
            When using <code>size="icon"</code>, provide an accessible name
            through <code>aria-label</code> if the button has no visible text.
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Links</h2>
          <p>
            Button supports polymorphic rendering through the <code>as</code>{" "}
            property. Use it to render an anchor instead of a native button. The
            properties of the selected element are inferred by TypeScript.
          </p>

          <Preview code={linkCode}>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/docs">Documentation</Button>
              <Button
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                External link
              </Button>
            </div>
          </Preview>

          <p>
            When rendering an anchor, use <code>href</code> and the appropriate
            navigation component for your routing framework when necessary. For
            example, Next.js applications can use their own Link component
            through <code>as</code>.
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Leading and trailing content
          </h2>
          <p>
            Add icons or other React elements before or after the button label
            using <code>leading</code> and <code>trailing</code>.
          </p>

          <Preview code={iconCode}>
            <div className="flex flex-wrap items-center gap-3">
              <Button leading={<span aria-hidden="true">↓</span>}>
                Download
              </Button>
              <Button
                trailing={<span aria-hidden="true">→</span>}
                variant="secondary"
              >
                Continue
              </Button>
            </div>
          </Preview>

          <p>
            Both properties accept any <code>ReactNode</code>, so you can use
            Puzzle icons, custom SVGs, or other React components.
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Loading and disabled states
          </h2>
          <p>
            Use <code>loading</code> to indicate that an action is being
            processed. The button displays a spinner and prevents further
            interaction while loading.
          </p>

          <Preview code={loadingCode}>
            <div className="flex flex-wrap items-center gap-3">
              <Button loading>Saving...</Button>
              <Button disabled variant="secondary">
                Unavailable
              </Button>
            </div>
          </Preview>

          <p>
            A loading button automatically receives <code>aria-busy</code> and
            behaves as disabled. You can also explicitly disable a button using{" "}
            <code>disabled</code>.
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Full width</h2>
          <p>
            Set <code>fullWidth</code> to make the button fill the available
            width of its container.
          </p>

          <Preview code={`<Button fullWidth>Continue</Button>`}>
            <div className="w-full max-w-md">
              <Button fullWidth>Continue</Button>
            </div>
          </Preview>
        </div>
      </Section>

      <Section>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Toggle buttons</h2>
          <p>
            The <code>toggle</code> and <code>toggle-active</code> variants
            provide visual styles for toggle-like actions. Manage the active
            state in your application and expose it with{" "}
            <code>aria-pressed</code>.
          </p>

          <Preview
            code={`const [active, setActive] = useState(false);

<Button
  variant={active ? "toggle-active" : "toggle"}
  aria-pressed={active}
  onClick={() => setActive((value) => !value)}
>
  Toggle
</Button>`}
          >
            <ToggleExample />
          </Preview>
        </div>
      </Section>

      <Section>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Form buttons</h2>
          <p>
            Buttons render as native HTML buttons by default. Use the{" "}
            <code>type</code> property to specify their behavior inside forms.
          </p>

          <Preview
            code={`<form onSubmit={handleSubmit}>
  <Button type="submit">Save</Button>
  <Button type="reset" variant="outline">Reset</Button>
  <Button type="button" variant="ghost">Cancel</Button>
</form>`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit">Submit</Button>
              <Button type="reset" variant="outline">
                Reset
              </Button>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </div>
          </Preview>

          <p>
            The default type is <code>button</code>, preventing accidental form
            submissions when a button is used inside a form.
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">API</h2>
          <p>
            Button accepts the following component-specific properties.
            Additional properties are inherited from the HTML element selected
            through <code>as</code>.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--puzzle-color-border)]">
                  <th className="px-3 py-3">Property</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Default</th>
                  <th className="px-3 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                <ApiRow
                  name="as"
                  type="ElementType"
                  defaultValue='"button"'
                  description="The HTML element or React component to render."
                />
                <ApiRow
                  name="variant"
                  type="ButtonVariant"
                  defaultValue='"primary"'
                  description="Visual style of the button."
                />
                <ApiRow
                  name="size"
                  type="ButtonSize"
                  defaultValue='"md"'
                  description="Controls the button dimensions."
                />
                <ApiRow
                  name="leading"
                  type="ReactNode"
                  defaultValue="—"
                  description="Content displayed before the label."
                />
                <ApiRow
                  name="trailing"
                  type="ReactNode"
                  defaultValue="—"
                  description="Content displayed after the label."
                />
                <ApiRow
                  name="loading"
                  type="boolean"
                  defaultValue="false"
                  description="Displays a loading indicator and prevents interaction."
                />
                <ApiRow
                  name="disabled"
                  type="boolean"
                  defaultValue="false"
                  description="Disables the button."
                />
                <ApiRow
                  name="fullWidth"
                  type="boolean"
                  defaultValue="false"
                  description="Makes the button fill its container width."
                />
                <ApiRow
                  name="className"
                  type="string"
                  defaultValue="—"
                  description="Additional CSS class names."
                />
                <ApiRow
                  name="children"
                  type="ReactNode"
                  defaultValue="—"
                  description="The button content."
                />
                <ApiRow
                  name="type"
                  type='"button" | "submit" | "reset"'
                  defaultValue='"button"'
                  description="Native button type. Only applied when rendering a native button."
                />
                <ApiRow
                  name="tabIndex"
                  type="number"
                  defaultValue="—"
                  description="Controls the element's position in sequential keyboard navigation."
                />
                <ApiRow
                  name="aria-label"
                  type="string"
                  defaultValue="—"
                  description="Accessible name, especially useful for icon-only buttons."
                />
                <ApiRow
                  name="aria-busy"
                  type="boolean"
                  defaultValue="—"
                  description="Indicates that the element is being updated."
                />
                <ApiRow
                  name="aria-disabled"
                  type="boolean"
                  defaultValue="—"
                  description="Exposes the disabled state through ARIA."
                />
                <ApiRow
                  name="onClick"
                  type="ElementProp<C, 'onClick'>"
                  defaultValue="—"
                  description="Click handler, typed according to the rendered element."
                />
                <ApiRow
                  name="onKeyDown"
                  type="ElementProp<C, 'onKeyDown'>"
                  defaultValue="—"
                  description="Keyboard event handler, typed according to the rendered element."
                />
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">TypeScript types</h2>

          <h3 className="text-lg font-semibold">ButtonVariant</h3>
          <pre className="overflow-x-auto rounded-lg bg-[var(--puzzle-color-surface-sunken)] p-4 text-sm">
            <code>{`type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link"
  | "toggle"
  | "toggle-active";`}</code>
          </pre>

          <h3 className="text-lg font-semibold">ButtonSize</h3>
          <pre className="overflow-x-auto rounded-lg bg-[var(--puzzle-color-surface-sunken)] p-4 text-sm">
            <code>{`type ButtonSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "icon";`}</code>
          </pre>

          <h3 className="text-lg font-semibold">ButtonProps</h3>
          <pre className="overflow-x-auto rounded-lg bg-[var(--puzzle-color-surface-sunken)] p-4 text-sm">
            <code>{`type ButtonProps<C extends ElementType = "button"> =
  ButtonOwnProps<C> &
  Omit<
    ComponentPropsWithRef<C>,
    keyof ButtonOwnProps<C> | "as"
  >;`}</code>
          </pre>

          <p>
            The generic <code>C</code> determines the rendered element.
            Consequently, native attributes and event handlers are automatically
            inferred. For example, <code>href</code> is available when using{" "}
            <code>as="a"</code>.
          </p>
        </div>
      </Section>
    </div>
  );
}

type ApiRowProps = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};

function ApiRow({ name, type, defaultValue, description }: ApiRowProps) {
  return (
    <tr className="border-b border-[var(--puzzle-color-border)] align-top">
      <td className="px-3 py-3 font-mono font-medium whitespace-nowrap">
        {name}
      </td>
      <td className="px-3 py-3 font-mono text-[var(--puzzle-color-text-muted)]">
        {type}
      </td>
      <td className="px-3 py-3 font-mono">{defaultValue}</td>
      <td className="px-3 py-3">{description}</td>
    </tr>
  );
}
