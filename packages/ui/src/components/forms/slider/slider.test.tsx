import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { afterEach, describe, expect, it, vi } from "vitest";

import { FormField } from "../form-field";
import { Slider } from "./index";

afterEach(() => {
  cleanup();
});

describe("Slider", () => {
  it("renders a native range input with slider semantics", () => {
    render(<Slider aria-label="Volume" />);

    const slider = screen.getByRole("slider", {
      name: "Volume",
    }) as HTMLInputElement;

    expect(slider.type).toBe("range");
    expect(slider.min).toBe("0");
    expect(slider.max).toBe("100");
    expect(slider.step).toBe("1");
    expect(slider.value).toBe("50");
  });

  it("supports custom bounds, step and defaultValue", () => {
    render(
      <Slider
        aria-label="Temperature"
        min={10}
        max={30}
        step={0.5}
        defaultValue={17.5}
      />,
    );

    const slider = screen.getByRole("slider") as HTMLInputElement;

    expect(slider.min).toBe("10");
    expect(slider.max).toBe("30");
    expect(slider.step).toBe("0.5");
    expect(slider.value).toBe("17.5");
  });

  it("normalizes the default value to the configured range and step", () => {
    render(
      <Slider
        aria-label="Volume"
        min={0}
        max={20}
        step={5}
        defaultValue={100}
      />,
    );

    expect(screen.getByRole("slider")).toHaveValue("20");
  });

  it("supports fractional step values", () => {
    render(
      <Slider
        aria-label="Opacity"
        min={0}
        max={1}
        step={0.1}
        defaultValue={0.3}
      />,
    );

    expect(screen.getByRole("slider")).toHaveValue("0.3");
  });

  it("supports step any", () => {
    render(
      <Slider
        aria-label="Precise value"
        min={0}
        max={1}
        step="any"
        defaultValue={0.35}
      />,
    );

    const slider = screen.getByRole("slider");

    expect(slider).toHaveAttribute("step", "any");
    expect(slider).toHaveValue("0.35");
  });

  it("updates uncontrolled values and calls onChange with a number", () => {
    const onChange = vi.fn();

    render(
      <Slider aria-label="Volume" defaultValue={25} onChange={onChange} />,
    );

    const slider = screen.getByRole("slider");

    fireEvent.change(slider, {
      target: { value: "75" },
    });

    expect(slider).toHaveValue("75");
    expect(onChange).toHaveBeenCalledWith(75);
    expect(typeof onChange.mock.calls[0]![0]).toBe("number");
  });

  it("supports controlled values", () => {
    const onChange = vi.fn();

    render(<Slider aria-label="Volume" value={25} onChange={onChange} />);

    const slider = screen.getByRole("slider");

    fireEvent.change(slider, {
      target: { value: "30" },
    });

    expect(onChange).toHaveBeenCalledWith(30);
    expect(slider).toHaveValue("25");
  });

  it("displays the formatted current value", () => {
    render(
      <Slider
        aria-label="Temperature"
        defaultValue={20}
        showValue
        formatValue={(value) => `${value} °C`}
      />,
    );

    const slider = screen.getByRole("slider");

    expect(screen.getByText("20 °C")).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuetext", "20 °C");
  });

  it("allows an explicit aria-valuetext to override the formatter", () => {
    render(
      <Slider
        aria-label="Temperature"
        defaultValue={20}
        formatValue={(value) => `${value} °C`}
        aria-valuetext="Twenty degrees Celsius"
      />,
    );

    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-valuetext",
      "Twenty degrees Celsius",
    );
  });

  it("renders marks in their correct positions", () => {
    const { container } = render(
      <Slider
        aria-label="Volume"
        min={0}
        max={100}
        marks={[
          { value: 0, label: "Quiet" },
          { value: 50, label: "Medium" },
          { value: 100, label: "Loud" },
        ]}
      />,
    );

    expect(screen.getByText("Quiet")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Loud")).toBeInTheDocument();

    const marks = container.querySelectorAll(".puzzle-slider__mark");

    expect(marks).toHaveLength(3);
    expect(marks[1]).toHaveStyle({
      insetInlineStart: "50%",
    });
  });

  it("ignores marks outside the allowed range", () => {
    const { container } = render(
      <Slider
        aria-label="Volume"
        min={0}
        max={100}
        marks={[
          { value: -10, label: "Invalid low" },
          { value: 50, label: "Medium" },
          { value: 120, label: "Invalid high" },
        ]}
      />,
    );

    expect(screen.queryByText("Invalid low")).not.toBeInTheDocument();
    expect(screen.queryByText("Invalid high")).not.toBeInTheDocument();

    expect(container.querySelectorAll(".puzzle-slider__mark")).toHaveLength(1);
  });

  it("supports all visual sizes", () => {
    const { rerender, container } = render(
      <Slider aria-label="Volume" size="sm" />,
    );

    expect(container.querySelector(".puzzle-slider")).toHaveAttribute(
      "data-size",
      "sm",
    );

    rerender(<Slider aria-label="Volume" size="md" />);

    expect(container.querySelector(".puzzle-slider")).toHaveAttribute(
      "data-size",
      "md",
    );

    rerender(<Slider aria-label="Volume" size="lg" />);

    expect(container.querySelector(".puzzle-slider")).toHaveAttribute(
      "data-size",
      "lg",
    );
  });

  it("forwards the disabled state to the native input", () => {
    render(<Slider aria-label="Volume" disabled />);

    expect(screen.getByRole("slider")).toBeDisabled();
  });

  it("forwards native form attributes", () => {
    const { container } = render(
      <form>
        <Slider aria-label="Volume" name="volume" defaultValue={75} required />
      </form>,
    );

    const slider = screen.getByRole("slider");

    expect(slider).toHaveAttribute("name", "volume");
    expect(slider).toHaveAttribute("required");

    const form = container.querySelector("form")!;

    expect(new FormData(form).get("volume")).toBe("75");
  });

  it("integrates with FormField labels and descriptions", () => {
    render(
      <FormField label="Volume" description="Adjust the audio volume.">
        <Slider defaultValue={50} />
      </FormField>,
    );

    const slider = screen.getByRole("slider", {
      name: "Volume",
    });

    expect(slider).toHaveAccessibleDescription("Adjust the audio volume.");
  });

  it("integrates with FormField validation", () => {
    render(
      <FormField
        label="Volume"
        description="Choose a volume."
        error="The selected volume is not allowed."
      >
        <Slider defaultValue={50} />
      </FormField>,
    );

    const slider = screen.getByRole("slider", {
      name: "Volume",
    });

    expect(slider).toHaveAttribute("aria-invalid", "true");

    expect(slider.getAttribute("aria-describedby")).toContain("-description");

    expect(slider.getAttribute("aria-describedby")).toContain("-error");

    expect(
      screen.getByText("The selected volume is not allowed."),
    ).toBeInTheDocument();
  });

  it("forwards its ref to the native input", () => {
    let input: HTMLInputElement | null = null;

    render(
      <Slider
        aria-label="Volume"
        ref={(node) => {
          input = node;
        }}
      />,
    );

    expect(input).toBe(screen.getByRole("slider"));
  });
});
