import { useState } from "react";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { JsonEditor, type JsonEditorResult } from "./index";

describe("JsonEditor", () => {
  it("associates the visible label and description with its textarea", () => {
    render(
      <JsonEditor
        label="Workspace settings"
        description="Edit the serialized settings."
        defaultValue='{"theme":"dark"}'
        name="settings"
        required
      />,
    );

    const textarea = screen.getByRole("textbox", {
      name: "Workspace settings",
    });

    expect(textarea).toHaveValue('{"theme":"dark"}');
    expect(textarea).toHaveAttribute("name", "settings");
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAccessibleDescription("Edit the serialized settings.");
  });

  it("formats valid JSON and announces the result", async () => {
    const user = userEvent.setup();
    render(
      <JsonEditor
        label="JSON source"
        defaultValue='{"title":"Puzzle","enabled":true}'
      />,
    );

    await user.click(screen.getByRole("button", { name: "Format JSON" }));

    expect(screen.getByRole("textbox", { name: "JSON source" })).toHaveValue(
      '{\n  "title": "Puzzle",\n  "enabled": true\n}',
    );
    expect(screen.getByRole("status")).toHaveTextContent("Valid JSON.");
  });

  it("reports syntax errors through a typed validation result", async () => {
    const user = userEvent.setup();
    const onValidate = vi.fn<(result: JsonEditorResult) => void>();

    render(
      <JsonEditor
        label="JSON source"
        defaultValue='{"title":}'
        onValidate={onValidate}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Validate JSON" }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "JSON source" }),
    ).toHaveAttribute("aria-invalid", "true");
    expect(onValidate).toHaveBeenCalledWith(
      expect.objectContaining({
        valid: false,
        error: expect.objectContaining({
          type: "parse",
          message: expect.any(String),
        }),
      }),
    );
  });

  it("does not format numbers that overflow the finite JavaScript range", async () => {
    const user = userEvent.setup();
    const onValidate = vi.fn<(result: JsonEditorResult) => void>();
    const onChange = vi.fn();
    const source = '{"nested":[1e309]}';
    render(
      <JsonEditor label="JSON source" value={source} onChange={onChange} onValidate={onValidate} />,
    );
    await user.click(screen.getByRole("button", { name: "Format JSON" }));
    expect(screen.getByRole("textbox", { name: "JSON source" })).toHaveValue(source);
    expect(screen.getByRole("alert")).toHaveTextContent("finite JavaScript number range");
    expect(onChange).not.toHaveBeenCalled();
    expect(onValidate).toHaveBeenCalledWith({
      valid: false,
      error: { type: "parse", message: "JSON numbers must be within the finite JavaScript number range." },
    });
  });

  it("runs caller validation against parsed JSON", async () => {
    const user = userEvent.setup();
    const onValidate = vi.fn<(result: JsonEditorResult) => void>();

    render(
      <JsonEditor
        label="JSON source"
        defaultValue='{"title":3}'
        validate={(value) =>
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value) &&
          typeof value.title === "string"
            ? null
            : "Expected an object with a string title."
        }
        onValidate={onValidate}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Validate JSON" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Expected an object with a string title.",
    );
    expect(onValidate).toHaveBeenCalledWith({
      valid: false,
      error: {
        type: "validation",
        message: "Expected an object with a string title.",
      },
    });
  });

  it("still formats finite JSON that fails caller validation", async () => {
    const user = userEvent.setup();
    render(
      <JsonEditor
        label="JSON source"
        defaultValue='{"title":3}'
        validate={() => "The title must be a string."}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Format JSON" }));
    expect(screen.getByRole("textbox", { name: "JSON source" })).toHaveValue('{\n  "title": 3\n}');
    expect(screen.getByRole("alert")).toHaveTextContent("The title must be a string.");
  });

  it("clears stale parse errors when the source changes", async () => {
    const user = userEvent.setup();
    render(<JsonEditor label="JSON source" defaultValue="{" />);

    await user.click(screen.getByRole("button", { name: "Validate JSON" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.clear(screen.getByRole("textbox", { name: "JSON source" }));
    await user.click(screen.getByRole("textbox", { name: "JSON source" }));
    await user.paste('{"ok":true}');

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "JSON source" }),
    ).not.toHaveAttribute("aria-invalid", "true");
  });

  it("supports externally supplied field errors", () => {
    render(
      <JsonEditor
        label="JSON source"
        defaultValue="{}"
        error="This value is not allowed."
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "This value is not allowed.",
    );
    expect(
      screen.getByRole("textbox", { name: "JSON source" }),
    ).toHaveAttribute("aria-invalid", "true");
  });

  it("notifies controlled source changes", async () => {
    const user = userEvent.setup();

    const ControlledJsonEditor = () => {
      const [source, setSource] = useState("{}");

      return (
        <JsonEditor
          label="JSON source"
          value={source}
          onChange={setSource}
        />
      );
    };

    render(<ControlledJsonEditor />);
    const textarea = screen.getByRole("textbox", { name: "JSON source" });
    await user.clear(textarea);
    await user.paste('{"ready":true}');

    expect(textarea).toHaveValue('{"ready":true}');
  });

  it("renders its labeled textarea during server rendering", () => {
    const markup = renderToStaticMarkup(
      <JsonEditor label="Settings" defaultValue="{}" />,
    );

    expect(markup).toContain("<label");
    expect(markup).toContain("Settings");
    expect(markup).toContain("<textarea");
    expect(markup).toContain("{}");
  });
});
