import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "vitest";

import { FormField } from "../form-field";
import { FileUpload } from "./index";

const createFile = (name: string, type = "image/png", size = 100) =>
  new File([new Uint8Array(size)], name, { type });

const getInput = (container: HTMLElement) =>
  container.querySelector('input[type="file"]') as HTMLInputElement;

describe("FileUpload", () => {
  it("renders the dropzone and its description", () => {
    render(
      <FileUpload title="Upload images" description="Select your images." />,
    );

    expect(
      screen.getByRole("button", { name: "Upload images" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Select your images.")).toBeInTheDocument();

    expect(screen.getByText("Browse files")).toBeInTheDocument();
  });

  it("renders accepted MIME types", () => {
    render(<FileUpload accept={["image/png", "application/pdf"]} />);

    expect(
      screen.getByText("Accepted: image/png, application/pdf"),
    ).toBeInTheDocument();
  });

  it("configures the native input", () => {
    const { container } = render(
      <FileUpload
        accept={["image/png", "image/jpeg"]}
        multiple
        name="attachments"
        required
      />,
    );

    const input = getInput(container);

    expect(input.accept).toBe("image/png,image/jpeg");
    expect(input.multiple).toBe(true);
    expect(input.name).toBe("attachments");
    expect(input.required).toBe(true);
  });

  it("supports a single file selection", () => {
    const onChange = vi.fn();

    const { container } = render(<FileUpload onChange={onChange} />);

    const input = getInput(container);

    fireEvent.change(input, {
      target: {
        files: [createFile("photo.png")],
      },
    });

    expect(screen.getByText("photo.png")).toBeInTheDocument();

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: "photo.png" }),
    ]);
  });

  it("replaces the previous file in single mode", () => {
    const { container } = render(<FileUpload />);

    const input = getInput(container);

    fireEvent.change(input, {
      target: {
        files: [createFile("first.png")],
      },
    });

    fireEvent.change(input, {
      target: {
        files: [createFile("second.png")],
      },
    });

    expect(screen.queryByText("first.png")).not.toBeInTheDocument();
    expect(screen.getByText("second.png")).toBeInTheDocument();
  });

  it("supports multiple files", () => {
    const onChange = vi.fn();

    const { container } = render(<FileUpload multiple onChange={onChange} />);

    fireEvent.change(getInput(container), {
      target: {
        files: [createFile("one.png"), createFile("two.png")],
      },
    });

    expect(screen.getByText("one.png")).toBeInTheDocument();
    expect(screen.getByText("two.png")).toBeInTheDocument();

    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ name: "one.png" }),
      expect.objectContaining({ name: "two.png" }),
    ]);
  });

  it("preserves previously selected files when adding more", () => {
    const { container } = render(<FileUpload multiple />);

    const input = getInput(container);

    fireEvent.change(input, {
      target: { files: [createFile("one.png")] },
    });

    fireEvent.change(input, {
      target: { files: [createFile("two.png")] },
    });

    expect(screen.getByText("one.png")).toBeInTheDocument();
    expect(screen.getByText("two.png")).toBeInTheDocument();
  });

  it("clears the native input after selection", () => {
    const { container } = render(<FileUpload />);

    const input = getInput(container);

    fireEvent.change(input, {
      target: { files: [createFile("photo.png")] },
    });

    expect(input.value).toBe("");
  });

  it("rejects unsupported MIME types", () => {
    const onReject = vi.fn();

    const { container } = render(
      <FileUpload accept={["image/png"]} onReject={onReject} />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [createFile("document.pdf", "application/pdf")],
      },
    });

    expect(onReject).toHaveBeenCalledWith([
      expect.objectContaining({
        code: "file-type",
      }),
    ]);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "This file type is not allowed.",
    );
  });

  it("rejects files exceeding maxFileSize", () => {
    const onReject = vi.fn();

    const { container } = render(
      <FileUpload maxFileSize={100} onReject={onReject} />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [createFile("large.png", "image/png", 200)],
      },
    });

    expect(onReject).toHaveBeenCalledWith([
      expect.objectContaining({
        code: "file-too-large",
      }),
    ]);
  });

  it("enforces maxFiles", () => {
    const onReject = vi.fn();

    const { container } = render(
      <FileUpload multiple maxFiles={2} onReject={onReject} />,
    );

    fireEvent.change(getInput(container), {
      target: {
        files: [
          createFile("one.png"),
          createFile("two.png"),
          createFile("three.png"),
        ],
      },
    });

    const selectedFiles = within(
      screen.getByRole("list", { name: "Selected files" }),
    );

    expect(selectedFiles.getByText("one.png")).toBeInTheDocument();
    expect(selectedFiles.getByText("two.png")).toBeInTheDocument();
    expect(selectedFiles.queryByText("three.png")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("three.png");

    expect(onReject).toHaveBeenCalledWith([
      expect.objectContaining({
        code: "too-many-files",
      }),
    ]);
  });

  it("enforces maxTotalSize across selections", () => {
    const onReject = vi.fn();

    const { container } = render(
      <FileUpload multiple maxTotalSize={150} onReject={onReject} />,
    );

    const input = getInput(container);

    fireEvent.change(input, {
      target: {
        files: [createFile("one.png", "image/png", 100)],
      },
    });

    fireEvent.change(input, {
      target: {
        files: [createFile("two.png", "image/png", 100)],
      },
    });

    const selectedFiles = within(
      screen.getByRole("list", { name: "Selected files" }),
    );

    expect(selectedFiles.getByText("one.png")).toBeInTheDocument();
    expect(selectedFiles.queryByText("two.png")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("two.png");

    expect(onReject).toHaveBeenLastCalledWith([
      expect.objectContaining({
        code: "total-too-large",
      }),
    ]);
  });

  it("clears previous rejection messages on a new selection", () => {
    const { container } = render(<FileUpload accept={["image/png"]} />);

    const input = getInput(container);

    fireEvent.change(input, {
      target: {
        files: [createFile("invalid.pdf", "application/pdf")],
      },
    });

    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(input, {
      target: {
        files: [createFile("valid.png")],
      },
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("removes a selected file", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { container } = render(<FileUpload multiple onChange={onChange} />);

    fireEvent.change(getInput(container), {
      target: {
        files: [createFile("photo.png")],
      },
    });

    await user.click(
      screen.getByRole("button", {
        name: "Remove photo.png",
      }),
    );

    expect(screen.queryByText("photo.png")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("does not select files when disabled", () => {
    const onChange = vi.fn();

    const { container } = render(<FileUpload disabled onChange={onChange} />);

    const input = getInput(container);

    expect(input).toBeDisabled();

    fireEvent.change(input, {
      target: {
        files: [createFile("photo.png")],
      },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByText("photo.png")).not.toBeInTheDocument();
  });

  it("supports FormField label and description association", () => {
    const { container } = render(
      <FormField
        label="Attachments"
        description="Upload your supporting documents."
      >
        <FileUpload />
      </FormField>,
    );

    const input = getInput(container);

    expect(input.id).not.toBe("");
    expect(screen.getByLabelText("Attachments")).toBe(input);
    expect(input).toHaveAccessibleDescription(
      "Upload your supporting documents. Drag and drop your files here or browse to select them.",
    );
  });

  it("opens the native picker when the dropzone is activated", async () => {
    const user = userEvent.setup();

    const { container } = render(<FileUpload />);

    const input = getInput(container);
    const click = vi.spyOn(input, "click");

    await user.click(screen.getByRole("button", { name: "Drop files here" }));

    expect(click).toHaveBeenCalled();
  });

  it("reports upload progress and completion", async () => {
    let resolveUpload: (() => void) | undefined;

    const onUpload = vi.fn(
      async (
        _file: File,
        {
          onProgress,
        }: {
          onProgress: (progress: number) => void;
          signal: AbortSignal;
        },
      ) => {
        onProgress(45);

        await new Promise<void>((resolve) => {
          resolveUpload = resolve;
        });
      },
    );

    const { container } = render(<FileUpload onUpload={onUpload} />);

    fireEvent.change(getInput(container), {
      target: {
        files: [createFile("photo.png")],
      },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("progressbar", {
          name: "Uploading photo.png",
        }),
      ).toHaveAttribute("aria-valuenow", "45");
    });

    resolveUpload?.();

    await waitFor(() => {
      expect(screen.getByText("Upload complete")).toBeInTheDocument();
    });
  });

  it("clamps upload progress to 0-100", async () => {
    let resolveUpload: (() => void) | undefined;

    const onUpload = async (
      _file: File,
      {
        onProgress,
      }: {
        onProgress: (progress: number) => void;
        signal: AbortSignal;
      },
    ) => {
      onProgress(150);

      await new Promise<void>((resolve) => {
        resolveUpload = resolve;
      });
    };

    const { container } = render(<FileUpload onUpload={onUpload} />);

    fireEvent.change(getInput(container), {
      target: {
        files: [createFile("photo.png")],
      },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("progressbar", {
          name: "Uploading photo.png",
        }),
      ).toHaveAttribute("aria-valuenow", "100");
    });

    resolveUpload?.();
  });

  it("displays upload errors", async () => {
    const onUpload = async () => {
      throw new Error("Network unavailable");
    };

    const { container } = render(<FileUpload onUpload={onUpload} />);

    fireEvent.change(getInput(container), {
      target: {
        files: [createFile("photo.png")],
      },
    });

    expect(await screen.findByText("Network unavailable")).toBeInTheDocument();
  });

  it("retries failed uploads", async () => {
    const user = userEvent.setup();

    let attempts = 0;

    const onUpload = async () => {
      attempts++;

      if (attempts === 1) {
        throw new Error("Temporary error");
      }
    };

    const { container } = render(<FileUpload onUpload={onUpload} />);

    fireEvent.change(getInput(container), {
      target: {
        files: [createFile("photo.png")],
      },
    });

    await screen.findByText("Temporary error");

    await user.click(
      screen.getByRole("button", {
        name: "Retry upload of photo.png",
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Upload complete")).toBeInTheDocument();
    });

    expect(attempts).toBe(2);
  });

  it("aborts an upload when the file is removed", async () => {
    const user = userEvent.setup();

    let uploadSignal: AbortSignal | undefined;

    const onUpload = (
      _file: File,
      { signal }: { signal: AbortSignal; onProgress: (value: number) => void },
    ) => {
      uploadSignal = signal;

      return new Promise<void>(() => {});
    };

    const { container } = render(<FileUpload onUpload={onUpload} />);

    fireEvent.change(getInput(container), {
      target: {
        files: [createFile("photo.png")],
      },
    });

    await waitFor(() => {
      expect(uploadSignal).toBeDefined();
    });

    await user.click(
      screen.getByRole("button", {
        name: "Remove photo.png",
      }),
    );

    expect(uploadSignal?.aborted).toBe(true);
  });

  it("keeps uploads independent for multiple files", async () => {
    const onUpload = vi.fn(
      async (
        _file: File,
        {
          onProgress,
        }: {
          onProgress: (progress: number) => void;
          signal: AbortSignal;
        },
      ) => {
        onProgress(50);
      },
    );

    const { container } = render(<FileUpload multiple onUpload={onUpload} />);

    fireEvent.change(getInput(container), {
      target: {
        files: [createFile("one.png"), createFile("two.png")],
      },
    });

    await waitFor(() => {
      expect(screen.getAllByText("Upload complete")).toHaveLength(2);
    });

    expect(onUpload).toHaveBeenCalledTimes(2);
  });
});
