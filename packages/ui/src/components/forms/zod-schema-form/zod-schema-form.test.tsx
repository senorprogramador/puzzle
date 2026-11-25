import { useState, type ComponentProps } from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { ZodSchemaForm } from "../../../zod";

type FormProps = ComponentProps<typeof ZodSchemaForm>;

type ControlledFormProps = Omit<FormProps, "value" | "onChange"> & {
  initialValue: FormProps["value"];
  onValueChange?: (value: FormProps["value"]) => void;
};

const ControlledForm = ({
  initialValue,
  onValueChange,
  ...formProps
}: ControlledFormProps) => {
  const [value, setValue] = useState(initialValue);

  return (
    <ZodSchemaForm
      {...formProps}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue);
        onValueChange?.(nextValue);
      }}
    />
  );
};

afterEach(() => {
  cleanup();
});

describe("ZodSchemaForm", () => {
  it("renders accessible controlled text, number, and boolean fields and immutably updates nested values", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const initialValue = {
      name: "Ada",
      age: 37,
      enabled: false,
      profile: { city: "London" },
    };
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      enabled: z.boolean(),
      profile: z.object({ city: z.string() }),
    });

    render(
      <ControlledForm
        schema={schema}
        initialValue={initialValue}
        onValueChange={onValueChange}
        fields={{
          name: { label: "Full name" },
          age: { label: "Age" },
          enabled: { label: "Enabled" },
          "profile.city": { label: "City" },
        }}
      />,
    );

    const name = screen.getByRole("textbox", { name: "Full name" });
    const age = screen.getByRole("spinbutton", { name: "Age" });
    const enabled = screen.getByRole("checkbox", { name: "Enabled" });
    const city = screen.getByRole("textbox", { name: "City" });

    expect(name).toHaveValue("Ada");
    expect(age).toHaveValue("37");
    expect(enabled).not.toBeChecked();
    expect(city).toHaveValue("London");

    await user.clear(name);
    await user.type(name, "Grace");
    await user.clear(age);
    await user.type(age, "42");
    await user.click(enabled);
    await user.clear(city);
    await user.type(city, "Amsterdam");

    expect(onValueChange).toHaveBeenLastCalledWith({
      name: "Grace",
      age: 42,
      enabled: true,
      profile: { city: "Amsterdam" },
    });
    expect(initialValue).toEqual({
      name: "Ada",
      age: 37,
      enabled: false,
      profile: { city: "London" },
    });
  });

  it("keeps raw controlled values separate from parsed transforms and defaults", async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    const validationStates: Array<{
      isValid: boolean;
      result: unknown;
    }> = [];
    const schema = z.object({
      quantity: z.string().transform((value) => Number(value)),
      state: z.string().default("draft"),
    });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{ quantity: "0042" }}
        onValueChange={(value) => values.push(value)}
        validationMode="submit"
        fields={{ quantity: { label: "Quantity" } }}
        onValidationChange={(state) => validationStates.push(state)}
        render={({ fields, validate }) => (
          <>
            {fields}
            <button type="button" onClick={() => void validate()}>
              Validate values
            </button>
          </>
        )}
      />,
    );

    const quantity = screen.getByRole("textbox", { name: "Quantity" });
    expect(quantity).toHaveValue("0042");

    await user.clear(quantity);
    await user.type(quantity, "0043");
    expect(values.at(-1)).toMatchObject({ quantity: "0043" });

    await user.click(screen.getByRole("button", { name: "Validate values" }));
    await waitFor(() =>
      expect(validationStates.some((state) => state.isValid)).toBe(true),
    );

    const successfulResult = validationStates.find(
      (state) => state.isValid && state.result !== null,
    )?.result;
    expect(successfulResult).toMatchObject({
      success: true,
      data: { quantity: 43, state: "draft" },
    });
    expect(quantity).toHaveValue("0043");
  });

  it("marks required fields while allowing optional fields to remain empty", () => {
    const schema = z.object({
      requiredName: z.string(),
      optionalName: z.string().optional(),
    });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{ requiredName: "", optionalName: undefined }}
        fields={{
          requiredName: { label: "Required name" },
          optionalName: { label: "Optional name" },
        }}
      />,
    );

    expect(
      screen.getByRole("textbox", { name: "Required name" }),
    ).toBeRequired();
    expect(
      screen.getByRole("textbox", { name: /^Optional name/ }),
    ).not.toBeRequired();
  });

  it("reports all validation messages for a nested field after explicit validation", async () => {
    const user = userEvent.setup();
    const validationStates: Array<{
      status: string;
      isValid: boolean;
      isValidating: boolean;
      errors: Readonly<Record<string, readonly string[]>>;
    }> = [];
    const schema = z.object({
      account: z.object({
        email: z
          .string()
          .min(8, "Use at least eight characters.")
          .email("Enter a valid email address."),
      }),
    });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{ account: { email: "x" } }}
        validationMode="submit"
        fields={{ "account.email": { label: "Account email" } }}
        onValidationChange={(state) => validationStates.push(state)}
        render={({ fields, errors, validate }) => (
          <>
            {fields}
            <button type="button" onClick={() => void validate()}>
              Validate form
            </button>
            <output aria-label="Email validation messages">
              {errors["#/account/email"]?.join(" ")}
            </output>
          </>
        )}
      />,
    );

    expect(
      screen.getByRole("textbox", { name: "Account email" }),
    ).not.toHaveAttribute("aria-invalid", "true");

    await user.click(screen.getByRole("button", { name: "Validate form" }));

    const messages = await screen.findByLabelText("Email validation messages");
    await waitFor(() =>
      expect(messages).toHaveTextContent(
        "Use at least eight characters. Enter a valid email address.",
      ),
    );
    expect(
      screen.getByRole("textbox", { name: "Account email" }),
    ).toHaveAttribute("aria-invalid", "true");
    expect(validationStates.at(-1)).toMatchObject({
      status: "invalid",
      isValid: false,
      isValidating: false,
      errors: {
        "#/account/email": expect.arrayContaining([
          "Use at least eight characters.",
          "Enter a valid email address.",
        ]),
      },
    });
  });

  it("ignores an older asynchronous validation result when a newer value validates first", async () => {
    const user = userEvent.setup();
    const pending = new Map<string, (isAvailable: boolean) => void>();
    const validationStates: Array<{
      status: string;
      isValidating: boolean;
    }> = [];
    const schema = z.object({
      username: z.string().refine(
        (value) =>
          new Promise<boolean>((resolve) => {
            pending.set(value, resolve);
          }),
        "That username is unavailable.",
      ),
    });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{ username: "old" }}
        validationMode="submit"
        fields={{ username: { label: "Username" } }}
        onValidationChange={(state) => validationStates.push(state)}
        render={({ fields, status, validate }) => (
          <>
            {fields}
            <button type="button" onClick={() => void validate()}>
              Validate username
            </button>
            <output aria-label="Validation status">{status}</output>
          </>
        )}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Validate username" }));
    await waitFor(() => expect(pending.has("old")).toBe(true));
    expect(
      validationStates.some(
        (state) => state.status === "validating" && state.isValidating,
      ),
    ).toBe(true);

    const username = screen.getByRole("textbox", { name: "Username" });
    await user.clear(username);
    await user.type(username, "new");
    await user.click(screen.getByRole("button", { name: "Validate username" }));
    await waitFor(() => expect(pending.has("new")).toBe(true));

    await act(async () => {
      pending.get("new")?.(true);
    });
    await waitFor(() =>
      expect(screen.getByLabelText("Validation status")).toHaveTextContent(
        "valid",
      ),
    );

    await act(async () => {
      pending.get("old")?.(false);
    });
    expect(screen.getByLabelText("Validation status")).toHaveTextContent(
      "valid",
    );
  });

  it("supports object groups and exposes diagnostics for unassigned fields", () => {
    const schema = z.object({
      profile: z.object({
        firstName: z.string(),
        email: z.string(),
      }),
      biography: z.string(),
    });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{
          profile: { firstName: "Ada", email: "ada@example.com" },
          biography: "Mathematician",
        }}
        unassignedFields="error"
        objects={{
          profile: {
            label: "Profile",
            groups: [
              {
                id: "identity",
                label: "Identity details",
                keys: ["firstName", "email"],
                columns: 2,
              },
            ],
          },
        }}
        fields={{
          "profile.firstName": { label: "First name" },
          "profile.email": { label: "Email address" },
          biography: { label: "Biography" },
        }}
        render={({ fields, unresolvedFields }) => (
          <>
            {fields}
            <output aria-label="Unassigned field diagnostics">
              {unresolvedFields.length}
            </output>
          </>
        )}
      />,
    );

    expect(
      screen.getByRole("group", { name: "Identity details" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "First name" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Email address" }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Unassigned field diagnostics"),
    ).toHaveTextContent(/[1-9]/);
  });

  it("prioritizes path-specific renderers over type renderers and preserves hidden values", async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    const schema = z.object({
      profile: z.object({
        name: z.string(),
        nickname: z.string(),
      }),
      secret: z.string(),
    });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{
          profile: { name: "Ada", nickname: "Countess" },
          secret: "keep me",
        }}
        onValueChange={(value) => values.push(value)}
        fields={{
          "profile.name": {
            render: ({ value, onChange }) => (
              <label>
                Preferred name
                <input
                  aria-label="Preferred name"
                  value={String(value ?? "")}
                  onChange={(event) => onChange(event.currentTarget.value)}
                />
              </label>
            ),
          },
          secret: { hidden: true },
        }}
        fieldTypes={{
          text: ({ key, value, onChange }) => (
            <button
              type="button"
              aria-label={`Set ${key}`}
              onClick={() => onChange(`${String(value)}!`)}
            >
              Use type renderer
            </button>
          ),
        }}
      />,
    );

    expect(
      screen.getByRole("textbox", { name: "Preferred name" }),
    ).toHaveValue("Ada");
    expect(
      screen.queryByRole("button", { name: "Set profile.name" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "secret" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Set / })).toHaveLength(1);

    await user.click(
      screen.getByRole("button", { name: "Set profile.nickname" }),
    );

    expect(values.at(-1)).toMatchObject({
      profile: { name: "Ada", nickname: "Countess!" },
      secret: "keep me",
    });
  });

  it("adds, edits, and removes array items through nested paths", async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    const schema = z.object({
      contacts: z.array(z.object({ email: z.string() })),
    });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{ contacts: [{ email: "first@example.com" }] }}
        onValueChange={(value) => values.push(value)}
        fields={{
          contacts: { label: "Contacts" },
          "contacts.0.email": { label: "Contact email" },
        }}
      />,
    );

    expect(
      screen.getByRole("group", { name: "Contacts" }),
    ).toBeInTheDocument();

    const email = screen.getByRole("textbox", { name: "Contact email" });
    await user.clear(email);
    await user.type(email, "updated@example.com");
    await user.click(screen.getByRole("button", { name: "Add item" }));

    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Remove item 1" }));

    expect(values.at(-1)).toMatchObject({
      contacts: [{ email: "" }],
    });
  });

  it("creates an array path when adding the first item to a partial value", async () => {
    const user = userEvent.setup();
    const values: unknown[] = [];
    const schema = z.object({ tags: z.array(z.string()) });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{}}
        onValueChange={(value) => values.push(value)}
        fields={{ tags: { label: "Tags" } }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add item" }));

    expect(values.at(-1)).toMatchObject({ tags: [""] });
    const tag = screen.getByRole("textbox", { name: "Value" });
    await user.type(tag, "react");

    expect(values.at(-1)).toMatchObject({ tags: ["react"] });
  });

  it("renders a diagnostic fallback for unsupported schema fields", () => {
    const schema = z.object({
      birthday: z.bigint(),
      name: z.string(),
    });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{
          birthday: 2000n,
          name: "Ada",
        }}
        fields={{ name: { label: "Name" } }}
        render={({ fields, unresolvedFields }) => (
          <>
            {fields}
            <output aria-label="Unsupported schema diagnostics">
              {unresolvedFields.length}
            </output>
          </>
        )}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Ada");
    expect(
      screen.getByLabelText("Unsupported schema diagnostics"),
    ).toHaveTextContent(/[1-9]/);
  });

  it("honors disabled and read-only field presentation overrides", () => {
    const schema = z.object({
      disabledName: z.string(),
      readOnlyName: z.string(),
    });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{ disabledName: "Ada", readOnlyName: "Lovelace" }}
        fields={{
          disabledName: { label: "Disabled name", disabled: true },
          readOnlyName: { label: "Read-only name", readOnly: true },
        }}
      />,
    );

    expect(
      screen.getByRole("textbox", { name: "Disabled name" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("textbox", { name: "Read-only name" }),
    ).toHaveAttribute("readonly");
  });

  it("applies global disabled and read-only states", () => {
    const schema = z.object({ name: z.string() });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{ name: "Ada" }}
        disabled
        fields={{ name: { label: "Disabled form name" } }}
      />,
    );
    expect(
      screen.getByRole("textbox", { name: "Disabled form name" }),
    ).toBeDisabled();

    cleanup();

    render(
      <ControlledForm
        schema={schema}
        initialValue={{ name: "Ada" }}
        readOnly
        fields={{ name: { label: "Read-only form name" } }}
      />,
    );
    expect(
      screen.getByRole("textbox", { name: "Read-only form name" }),
    ).toHaveAttribute("readonly");
  });

  it.each(["blur", "touched"] as const)(
    "validates on blur in %s mode",
    async (validationMode) => {
      const user = userEvent.setup();
      const schema = z.object({
        name: z.string().min(2, "Enter two characters."),
      });

      render(
        <ControlledForm
          schema={schema}
          initialValue={{ name: "" }}
          validationMode={validationMode}
          fields={{ name: { label: "Name" } }}
        />,
      );

      const name = screen.getByRole("textbox", { name: "Name" });
      expect(name).not.toHaveAttribute("aria-invalid", "true");

      await user.click(name);
      await user.tab();

      await waitFor(() =>
        expect(name).toHaveAttribute("aria-invalid", "true"),
      );
      expect(screen.getByText("Enter two characters.")).toBeInTheDocument();
    },
  );

  it("debounces change validation when multiple validation modes are enabled", async () => {
    const user = userEvent.setup();
    const validationStates: Array<{ status: string }> = [];
    const schema = z.object({ query: z.string().min(1) });

    render(
      <ControlledForm
        schema={schema}
        initialValue={{ query: "" }}
        validationMode={["change", "blur"]}
        validationDebounceMs={100}
        fields={{ query: { label: "Query" } }}
        onValidationChange={(state) => validationStates.push(state)}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: "Query" }), "search");

    await waitFor(() =>
      expect(validationStates.some((state) => state.status === "valid")).toBe(
        true,
      ),
    );
    expect(
      validationStates.filter((state) => state.status === "valid"),
    ).toHaveLength(1);
  });
});
