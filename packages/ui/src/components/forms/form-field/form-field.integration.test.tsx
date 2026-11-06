import { cleanup, render, screen } from "@testing-library/react";
import { cloneElement, type ReactElement } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { Checkbox } from "../checkbox";
import { NumberInput, TextAreaInput, TextInput } from "../input";
import { Select } from "../select";
import { Switch } from "../switch";
import { FormField } from "./index";

afterEach(() => {
  cleanup();
});

const options = [
  { value: "nl", label: "Netherlands" },
  { value: "es", label: "Spain" },
];

type Case = {
  name: string;
  role: string;
  control: () => React.ReactElement;
};

const cases: Case[] = [
  {
    name: "Select",
    role: "combobox",
    control: () => <Select options={options} />,
  },
  { name: "Checkbox", role: "checkbox", control: () => <Checkbox /> },
  { name: "Switch", role: "switch", control: () => <Switch /> },
  { name: "TextInput", role: "textbox", control: () => <TextInput /> },
  { name: "TextAreaInput", role: "textbox", control: () => <TextAreaInput /> },
  { name: "NumberInput", role: "spinbutton", control: () => <NumberInput /> },
];

const ids = (value: string | null) => (value ?? "").split(" ").filter(Boolean);

describe.each(cases)("FormField with $name", ({ role, control }) => {
  it("labels the control and shares its id", () => {
    render(
      <FormField label="Field label" controlId="field">
        {control()}
      </FormField>,
    );

    const element = screen.getByRole(role, { name: "Field label" });

    expect(element).toHaveAttribute("id", "field");
  });

  it("links description and error through aria-describedby", () => {
    render(
      <FormField label="Field label" description="Helpful" error="Broken">
        {control()}
      </FormField>,
    );

    const element = screen.getByRole(role, { name: "Field label" });
    const describedBy = ids(element.getAttribute("aria-describedby"));

    expect(describedBy).toContain(screen.getByText("Helpful").id);
    expect(describedBy).toContain(screen.getByText("Broken").id);
    expect(element).toHaveAttribute("aria-invalid", "true");
  });

  it("keeps external aria-describedby relations", () => {
    const child = control() as ReactElement<Record<string, unknown>>;

    render(
      <>
        <span id="external">External</span>
        <FormField label="Field label" description="Helpful">
          {cloneElement(child, { "aria-describedby": "external" })}
        </FormField>
      </>,
    );

    const describedBy = ids(
      screen
        .getByRole(role, { name: "Field label" })
        .getAttribute("aria-describedby"),
    );

    expect(describedBy[0]).toBe("external");
    expect(describedBy).toContain(screen.getByText("Helpful").id);
  });

  it("forwards required and disabled", () => {
    render(
      <FormField label="Field label" required disabled>
        {control()}
      </FormField>,
    );

    const element = screen.getByRole(role, { name: /Field label/ });

    expect(element).toBeDisabled();
    expect(
      element.hasAttribute("required") ||
        element.getAttribute("aria-required") === "true",
    ).toBe(true);
  });

  it("is not invalid without an error", () => {
    render(<FormField label="Field label">{control()}</FormField>);

    expect(screen.getByRole(role, { name: "Field label" })).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});

describe("FormField with Select invalid state", () => {
  const rootOf = () =>
    document.querySelector<HTMLElement>(".puzzle-select") as HTMLElement;

  it("matches data-invalid to the FormField error", () => {
    render(
      <FormField label="Country" error="Required">
        <Select options={options} />
      </FormField>,
    );

    expect(rootOf()).toHaveAttribute("data-invalid", "true");
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("is not marked invalid when invalid is false", () => {
    render(
      <FormField label="Country" error="Required" invalid={false}>
        <Select options={options} />
      </FormField>,
    );

    expect(rootOf()).not.toHaveAttribute("data-invalid");
    expect(screen.getByRole("combobox")).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
