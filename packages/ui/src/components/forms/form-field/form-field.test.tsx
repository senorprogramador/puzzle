import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Checkbox } from "../checkbox";
import { TextInput } from "../input";
import { Select } from "../select";
import { FormField } from "./index";

afterEach(() => {
  cleanup();
});

describe("FormField", () => {
  it("associates the visible label with the control", () => {
    render(
      <FormField label="Email address">
        <TextInput type="email" />
      </FormField>,
    );

    expect(
      screen.getByRole("textbox", { name: "Email address" }),
    ).toBeInTheDocument();
  });

  it("associates the description with the control", () => {
    render(
      <FormField
        label="Email address"
        description="We will never share your email address."
      >
        <TextInput type="email" />
      </FormField>,
    );

    const input = screen.getByRole("textbox", {
      name: "Email address",
    });

    const description = screen.getByText(
      "We will never share your email address.",
    );

    expect(input).toHaveAttribute("aria-describedby", description.id);

    expect(description.id).not.toBe("");
  });

  it("associates the error message and marks the control invalid", () => {
    render(
      <FormField label="Email address" error="Enter a valid email address.">
        <TextInput type="email" />
      </FormField>,
    );

    const input = screen.getByRole("textbox", {
      name: "Email address",
    });

    const error = screen.getByText("Enter a valid email address.");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", error.id);
    expect(error).toHaveAttribute("aria-live", "polite");
  });

  it("combines description and error IDs", () => {
    render(
      <FormField
        label="Email address"
        description="Use your work email."
        error="This email is already registered."
      >
        <TextInput type="email" />
      </FormField>,
    );

    const input = screen.getByRole("textbox", {
      name: "Email address",
    });

    const description = screen.getByText("Use your work email.");
    const error = screen.getByText("This email is already registered.");

    expect(input.getAttribute("aria-describedby")?.split(" ")).toEqual([
      description.id,
      error.id,
    ]);
  });

  it("preserves existing aria-describedby values", () => {
    render(
      <>
        <span id="external-description">External help</span>

        <FormField label="Email address" description="Use your work email.">
          <TextInput type="email" aria-describedby="external-description" />
        </FormField>
      </>,
    );

    const input = screen.getByRole("textbox", {
      name: "Email address",
    });

    const description = screen.getByText("Use your work email.");

    expect(input.getAttribute("aria-describedby")?.split(" ")).toEqual([
      "external-description",
      description.id,
    ]);
  });

  it("forwards required and disabled to the control", () => {
    render(
      <FormField label="Email address" required disabled>
        <TextInput type="email" />
      </FormField>,
    );

    const input = screen.getByRole("textbox", {
      name: "Email address",
    });

    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  it("supports an explicitly supplied control ID", () => {
    render(
      <FormField label="Email address" controlId="account-email">
        <TextInput type="email" />
      </FormField>,
    );

    expect(
      screen.getByRole("textbox", { name: "Email address" }),
    ).toHaveAttribute("id", "account-email");
  });

  it("supports controls that already render their own label", () => {
    render(
      <FormField description="Accept the terms to continue.">
        <Checkbox label="Accept terms" />
      </FormField>,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Accept terms",
    });

    const description = screen.getByText("Accept the terms to continue.");

    expect(checkbox).toHaveAttribute("aria-describedby", description.id);
  });

  it("works with Select without requiring its internal label API", () => {
    render(
      <FormField
        label="Country"
        description="Choose your country of residence."
      >
        <Select
          options={[
            { value: "nl", label: "Netherlands" },
            { value: "es", label: "Spain" },
          ]}
        />
      </FormField>,
    );

    const select = screen.getByRole("combobox", {
      name: "Country",
    });

    expect(select).toHaveAttribute("aria-describedby");
    expect(select).toHaveAttribute("id");
  });

  it("does not show an error when invalid is explicitly false", () => {
    render(
      <FormField label="Email address" error="Invalid email" invalid={false}>
        <TextInput type="email" />
      </FormField>,
    );

    expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "Email address" }),
    ).not.toHaveAttribute("aria-invalid", "true");
  });

  it("supports an explicit invalid state without an error message", () => {
    render(
      <FormField label="Email address" invalid>
        <TextInput type="email" />
      </FormField>,
    );

    expect(
      screen.getByRole("textbox", { name: "Email address" }),
    ).toHaveAttribute("aria-invalid", "true");
  });
});
