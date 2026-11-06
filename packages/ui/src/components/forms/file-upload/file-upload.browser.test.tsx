import { render, screen, fireEvent } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { userEvent as browserUserEvent } from "vitest/browser";

import { afterEach, describe, expect, it, vi } from "vitest";

import { FormField } from "../form-field";
import { FileUpload } from "./index";

afterEach(() => {
  vi.restoreAllMocks();
});

const createFile = (name: string, type = "image/png") =>
  new File(["file content"], name, { type });

const getInput = (container: HTMLElement) =>
  container.querySelector('input[type="file"]') as HTMLInputElement;

const createDataTransfer = (files: File[]) => {
  const dataTransfer = new DataTransfer();

  files.forEach((file) => {
    dataTransfer.items.add(file);
  });

  return dataTransfer;
};

const fireDragEvent = (
  element: HTMLElement,
  type: "dragenter" | "dragleave" | "dragover" | "drop",
  dataTransfer: DataTransfer,
) => {
  // Testing Library's drag helpers clone DataTransfer without its native files.
  fireEvent(
    element,
    new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer }),
  );
};

describe("FileUpload (browser)", () => {
  it("supports keyboard focus", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Before</button>

        <FileUpload />

        <button type="button">After</button>
      </>,
    );

    const dropzone = screen.getByRole("button", {
      name: "Drop files here",
    });

    await user.tab();

    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();

    await user.tab();

    expect(dropzone).toHaveFocus();

    await user.tab();

    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("opens the native picker with Enter", async () => {
    const { container } = render(<FileUpload />);

    const input = getInput(container);
    const click = vi.fn();

    input.addEventListener("click", click);

    await browserUserEvent.tab();
    await browserUserEvent.keyboard("{Enter}");

    expect(click).toHaveBeenCalledTimes(1);
  });

  it("opens the native picker with Space", async () => {
    const { container } = render(<FileUpload />);

    const input = getInput(container);
    const click = vi.fn();

    input.addEventListener("click", click);

    await browserUserEvent.tab();
    await browserUserEvent.keyboard(" ");

    expect(click).toHaveBeenCalledTimes(1);
  });

  it("does not receive keyboard focus when disabled", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Before</button>

        <FileUpload disabled />

        <button type="button">After</button>
      </>,
    );

    await user.tab();

    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();

    await user.tab();

    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("shows the active drag state", () => {
    render(<FileUpload />);

    const dropzone = screen.getByRole("button", {
      name: "Drop files here",
    });

    const dataTransfer = createDataTransfer([createFile("photo.png")]);

    fireDragEvent(dropzone, "dragenter", dataTransfer);

    expect(dropzone).toHaveAttribute("data-dragging", "true");

    fireDragEvent(dropzone, "dragleave", dataTransfer);

    expect(dropzone).not.toHaveAttribute("data-dragging");
  });

  it("shows a rejected drag state for unsupported MIME types", () => {
    render(<FileUpload accept={["image/png"]} />);

    const dropzone = screen.getByRole("button", {
      name: "Drop files here",
    });

    const dataTransfer = createDataTransfer([
      createFile("document.pdf", "application/pdf"),
    ]);

    fireDragEvent(dropzone, "dragenter", dataTransfer);

    expect(dropzone).toHaveAttribute("data-dragging", "true");
    expect(dropzone).toHaveAttribute("data-rejected", "true");
  });

  it("accepts a dropped file", () => {
    const onChange = vi.fn();

    render(<FileUpload onChange={onChange} />);

    const dropzone = screen.getByRole("button", {
      name: "Drop files here",
    });

    const file = createFile("photo.png");

    const dataTransfer = createDataTransfer([file]);

    fireDragEvent(dropzone, "dragenter", dataTransfer);
    fireDragEvent(dropzone, "dragover", dataTransfer);
    fireDragEvent(dropzone, "drop", dataTransfer);

    expect(screen.getByText("photo.png")).toBeInTheDocument();

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: "photo.png" }),
    ]);

    expect(dropzone).not.toHaveAttribute("data-dragging");
  });

  it("rejects a dropped file with an unsupported MIME type", () => {
    const onReject = vi.fn();

    render(<FileUpload accept={["image/png"]} onReject={onReject} />);

    const dropzone = screen.getByRole("button", {
      name: "Drop files here",
    });

    const dataTransfer = createDataTransfer([
      createFile("document.pdf", "application/pdf"),
    ]);

    fireDragEvent(dropzone, "dragenter", dataTransfer);
    fireDragEvent(dropzone, "drop", dataTransfer);

    expect(onReject).toHaveBeenCalledWith([
      expect.objectContaining({
        code: "file-type",
      }),
    ]);
  });

  it("supports dropping multiple files", () => {
    const onChange = vi.fn();

    render(<FileUpload multiple onChange={onChange} />);

    const dropzone = screen.getByRole("button", {
      name: "Drop files here",
    });

    const dataTransfer = createDataTransfer([
      createFile("one.png"),
      createFile("two.png"),
    ]);

    fireDragEvent(dropzone, "drop", dataTransfer);

    expect(screen.getByText("one.png")).toBeInTheDocument();
    expect(screen.getByText("two.png")).toBeInTheDocument();

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: "one.png" }),
      expect.objectContaining({ name: "two.png" }),
    ]);
  });

  it("supports native file selection", async () => {
    const user = userEvent.setup();

    const { container } = render(<FileUpload />);

    const input = getInput(container);
    const file = createFile("photo.png");

    await user.upload(input, file);

    expect(screen.getByText("photo.png")).toBeInTheDocument();
  });

  it("allows the FormField label to activate the native input", async () => {
    const { container } = render(
      <FormField label="Attachments">
        <FileUpload />
      </FormField>,
    );

    const input = getInput(container);
    const click = vi.fn();

    input.addEventListener("click", click);

    fireEvent.click(screen.getByText("Attachments"));

    expect(click).toHaveBeenCalled();
  });

  it("keeps focus visible when navigating with a keyboard", async () => {
    render(
      <>
        <button type="button">Before</button>
        <FileUpload />
      </>,
    );

    await browserUserEvent.tab();
    await browserUserEvent.tab();

    const dropzone = screen.getByRole("button", {
      name: "Drop files here",
    });

    expect(dropzone).toHaveFocus();
    expect(dropzone.matches(":focus-visible")).toBe(true);
  });
});
