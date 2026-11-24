import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

import { TextInput } from "../../forms/input/text-input";
import { Drawer } from "../drawer";
import { Dialog } from "./index";

const InputForm = ({ container }: { container: "Dialog" | "Drawer" }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(["", "", ""]);
  const inputs = values.map((value, index) => (
    <TextInput
      key={index}
      aria-label={`Field ${index + 1}`}
      value={value}
      onChange={(event) => {
        const nextValue = event.currentTarget.value;
        setValues((current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? nextValue : item,
          ),
        );
      }}
    />
  ));

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open form
      </button>
      {container === "Dialog" ? (
        <Dialog
          open={open}
          onOpenChange={(nextOpen) => setOpen(nextOpen)}
          title="Input form"
        >
          {inputs}
        </Dialog>
      ) : (
        <Drawer
          open={open}
          onOpenChange={(nextOpen) => setOpen(nextOpen)}
          aria-label="Input form"
        >
          {inputs}
        </Drawer>
      )}
    </>
  );
};

afterEach(() => {
  cleanup();
});

describe.each(["Dialog", "Drawer"] as const)("%s inputs (browser)", (container) => {
  it("preserves focus and native text editing across controlled form updates", async () => {
    render(<InputForm container={container} />);
    await userEvent.click(screen.getByRole("button", { name: "Open form" }));
    await screen.findByRole("dialog", { name: "Input form" });

    for (const index of [1, 2, 0]) {
      const input = screen.getByRole("textbox", {
        name: `Field ${index + 1}`,
      }) as HTMLInputElement;

      await userEvent.click(input);
      await userEvent.keyboard("abc");
      expect(input).toHaveFocus();
      expect(input).toHaveValue("abc");

      await userEvent.keyboard("{Backspace}");
      expect(input).toHaveFocus();
      expect(input).toHaveValue("ab");

      await userEvent.keyboard("{ArrowLeft}");
      expect(input).toHaveFocus();
      expect(input.selectionStart).toBe(1);

      await userEvent.keyboard("{Delete}");
      expect(input).toHaveFocus();
      expect(input).toHaveValue("a");

      await userEvent.keyboard("{ArrowLeft}Z{ArrowRight}!");
      expect(input).toHaveFocus();
      expect(input).toHaveValue("Za!");
    }

    for (const input of screen.getAllByRole("textbox")) {
      expect(input).toHaveValue("Za!");
    }
  });

  it("keeps Tab navigation trapped and restores focus after editing and Escape", async () => {
    render(<InputForm container={container} />);
    const trigger = screen.getByRole("button", { name: "Open form" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Input form" });
    const firstControl = screen.getByRole(
      container === "Dialog" ? "button" : "separator",
      { name: container === "Dialog" ? "Close dialog" : "Resize drawer" },
    );
    await waitFor(() => expect(firstControl).toHaveFocus());

    await userEvent.tab();
    expect(screen.getByRole("textbox", { name: "Field 1" })).toHaveFocus();
    await userEvent.tab();
    const second = screen.getByRole("textbox", { name: "Field 2" });
    expect(second).toHaveFocus();
    await userEvent.keyboard("edited");
    expect(second).toHaveFocus();
    await userEvent.tab();
    const last = screen.getByRole("textbox", { name: "Field 3" });
    expect(last).toHaveFocus();
    await userEvent.tab();
    expect(firstControl).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(last).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
