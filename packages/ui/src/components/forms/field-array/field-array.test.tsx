import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FieldArray, RepeaterField } from "./index";

type LinkItem = {
  id: string;
  label: string;
};

const initialItems: LinkItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
];

const FieldArrayExample = ({
  initialValue = initialItems,
  minItems = 0,
  maxItems,
}: {
  initialValue?: LinkItem[];
  minItems?: number;
  maxItems?: number;
}) => {
  const [items, setItems] = useState(initialValue);
  const nextId = items.length + 1;

  return (
    <FieldArray
      label="Navigation links"
      description="Add and order links."
      items={items}
      onChange={setItems}
      createItem={() => ({ id: `link-${nextId}`, label: "" })}
      getItemKey={(item) => item.id}
      itemLabel={(item, index) => item.label || `Link ${index + 1}`}
      renderItem={({ item, index }) => (
        <input
          aria-label={`Link label ${index + 1}`}
          value={item.label}
          onChange={(event) => {
            setItems((current) =>
              current.map((entry, entryIndex) =>
                entryIndex === index
                  ? { ...entry, label: event.currentTarget.value }
                  : entry,
              ),
            );
          }}
        />
      )}
      minItems={minItems}
      maxItems={maxItems}
      reorderable
    />
  );
};

const ValidatingFieldArray = () => {
  const [items, setItems] = useState<string[]>([]);

  return (
    <FieldArray
      label="Required sections"
      items={items}
      onChange={setItems}
      createItem={() => "section"}
      renderItem={({ item }) => <span>{item}</span>}
      validate={(currentItems) =>
        currentItems.length > 0 ? null : "Add at least one section."
      }
    />
  );
};

describe("FieldArray", () => {
  it("renders a named group and controlled nested fields", () => {
    render(<FieldArrayExample />);

    expect(
      screen.getByRole("group", { name: "Navigation links" }),
    ).toHaveAccessibleDescription("Add and order links.");
    expect(screen.getByLabelText("Link label 1")).toHaveValue("Home");
    expect(screen.getByLabelText("Link label 2")).toHaveValue("About");
  });

  it("adds and removes entries while respecting item limits", async () => {
    const user = userEvent.setup();
      render(<FieldArrayExample initialValue={[initialItems[0]!]} maxItems={3} />);

    await user.click(screen.getByRole("button", { name: "Add item" }));
    expect(screen.getByLabelText("Link label 2")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Add item" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Add item" }));
    expect(screen.getByRole("button", { name: "Add item" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Remove item 1" }));
    expect(screen.getByLabelText("Link label 1")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Add item" })).toBeEnabled();
  });

  it("reorders entries using the built-in actions", async () => {
    const user = userEvent.setup();
    const { container } = render(<FieldArrayExample />);

    await user.click(screen.getByRole("button", { name: "Move item 2 up" }));

    expect(
      Array.from(
        container.querySelectorAll(".puzzle-field-array__item-legend"),
      ).map((legend) => legend.textContent),
    ).toEqual(["About", "Home"]);
  });

  it("prevents removing items below the configured minimum", () => {
    render(
      <FieldArrayExample
        initialValue={[initialItems[0]!]}
        minItems={1}
      />,
    );

    const group = screen.getByRole("group", { name: "Navigation links" });
    const removeButton = within(group).getByRole("button", {
      name: "Remove item 1",
    });

    expect(removeButton).toBeDisabled();
  });

  it("announces validation errors and clears them after a valid update", async () => {
    const user = userEvent.setup();
    render(<ValidatingFieldArray />);

    const requiredGroup = screen.getByRole("group", {
      name: "Required sections",
    });
    expect(requiredGroup).toHaveAttribute("aria-invalid", "true");
    expect(requiredGroup).toHaveAccessibleDescription(
      "Add at least one section.",
    );

    await user.click(
      screen.getByRole("button", { name: "Add item" }),
    );
    expect(
      screen.getByRole("group", { name: "Required sections" }),
    ).not.toHaveAttribute("aria-invalid", "true");
  });

  it("exports RepeaterField as the same controlled repeatable-field primitive", () => {
    render(
      <RepeaterField
        label="Tags"
        items={["news"]}
        onChange={() => {}}
        createItem={() => "updates"}
        renderItem={({ item }) => <span>{item}</span>}
      />,
    );

    expect(screen.getByText("news")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Tags" })).toBeInTheDocument();
  });

  it("renders its initial semantic groups during server rendering", () => {
    const markup = renderToStaticMarkup(
      <FieldArray
        label="Sections"
        items={["Hero"]}
        onChange={() => {}}
        createItem={() => "Feature"}
        renderItem={({ item }) => <span>{item}</span>}
      />,
    );

    expect(markup).toContain("<fieldset");
    expect(markup).toContain("<legend");
    expect(markup).toContain("Sections");
    expect(markup).toContain("Hero");
  });
});
