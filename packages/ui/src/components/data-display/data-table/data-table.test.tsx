import { StrictMode } from "react";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "./data-table";

type Person = {
  name: string;
  age: number | null;
};

const headers = ["Name", "Age"];
const renderPerson = (person: Person) => [person.name, person.age];
const getPersonSortValue = (person: Person, columnIndex: number) =>
  columnIndex === 0 ? person.name : person.age;
const getPersonSearchValue = (person: Person) =>
  `${person.name} ${person.age ?? ""}`;

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

describe("DataTable", () => {
  it("renders native table semantics, ReactNodes, nulls, and numeric zero", () => {
    render(
      <DataTable<Person>
        numberOfItems={2}
        header={[<span key="name">Name</span>, "Age"]}
        columnSizes={[180, "auto"]}
        initialItems={[
          { name: "Ada", age: 0 },
          { name: "Grace", age: null },
        ]}
        renderCell={(person) => [
          <strong key={person.name}>{person.name}</strong>,
          person.age,
        ]}
        requestItems={vi.fn()}
      />,
    );

    expect(screen.getByRole("table").querySelector("thead")).not.toBeNull();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeTruthy();
    expect(screen.getByText("Ada").tagName).toBe("STRONG");
    expect(screen.getByRole("cell", { name: "0" })).toBeTruthy();
    expect(screen.getAllByRole("cell")[3]).toBeEmptyDOMElement();
    expect(screen.getByRole("table").querySelector("col")?.getAttribute("style")).toContain(
      "width: 180px",
    );
    expect(screen.queryByRole("navigation", { name: "Table pagination" })).toBeNull();
  });

  it("requests the full range without pagination and skips empty requests", async () => {
    const requestItems = vi.fn(async () => [{ name: "Ada", age: 36 }]);
    render(
      <DataTable
        numberOfItems={1}
        header={headers}
        renderCell={renderPerson}
        requestItems={requestItems}
      />,
    );

    await screen.findByText("Ada");
    expect(requestItems).toHaveBeenCalledWith(0, 1);
  });

  it("deduplicates the initial request in React Strict Mode", async () => {
    const requestItems = vi.fn(async () => [{ name: "One", age: 1 }]);
    render(
      <StrictMode>
        <DataTable
          numberOfItems={1}
          header={headers}
          renderCell={renderPerson}
          requestItems={requestItems}
        />
      </StrictMode>,
    );

    await screen.findByText("One");
    expect(requestItems).toHaveBeenCalledTimes(1);
  });

  it("does not fetch data already provided for the initial render", () => {
    const requestItems = vi.fn(async () => []);
    const markup = renderToString(
      <DataTable
        numberOfItems={1}
        header={headers}
        initialItems={[{ name: "Server data", age: 1 }]}
        renderCell={renderPerson}
        requestItems={requestItems}
      />,
    );

    expect(markup).toContain("Server data");
    expect(requestItems).not.toHaveBeenCalled();
  });

  it("renders deterministic loading markup during SSR without requesting data", () => {
    const requestItems = vi.fn(async () => []);
    const markup = renderToString(
      <DataTable
        numberOfItems={1}
        header={headers}
        renderCell={renderPerson}
        requestItems={requestItems}
      />,
    );

    expect(markup).toContain("Loading");
    expect(requestItems).not.toHaveBeenCalled();
  });

  it("hydrates server-provided rows without recoverable errors or refetching", async () => {
    const requestItems = vi.fn(async () => []);
    const element = (
      <DataTable
        numberOfItems={1}
        header={headers}
        initialItems={[{ name: "Hydrated", age: 1 }]}
        renderCell={renderPerson}
        requestItems={requestItems}
      />
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(element);
    const onRecoverableError = vi.fn();
    const root = hydrateRoot(container, element, { onRecoverableError });

    try {
      await act(async () => {});
      expect(container).toHaveTextContent("Hydrated");
      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(requestItems).not.toHaveBeenCalled();
    } finally {
      act(() => root.unmount());
    }
  });

  it("uses exclusive ranges for pagination and handles a partial last page", async () => {
    const user = userEvent.setup();
    const requestItems = vi.fn(async () => [{ name: "Eve", age: 25 }]);
    render(
      <DataTable
        numberOfItems={5}
        itemsPerPage={2}
        header={headers}
        initialItems={[
          { name: "Ada", age: 1 },
          { name: "Bea", age: 2 },
        ]}
        renderCell={renderPerson}
        requestItems={requestItems}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Go to page 3" }));
    await screen.findByText("Eve");

    expect(requestItems).toHaveBeenCalledWith(4, 5);
    expect(
      screen.getByRole("navigation", { name: "Table pagination" }),
    ).toBeInTheDocument();
  });

  it("clamps the current page when the dataset shrinks", async () => {
    const user = userEvent.setup();
    const requestItems = vi.fn(async () => [{ name: "Updated", age: 3 }]);
    const props = {
      header: headers,
      itemsPerPage: 1,
      initialItems: [{ name: "Initial", age: 1 }],
      renderCell: renderPerson,
      requestItems,
    };
    const { rerender } = render(<DataTable {...props} numberOfItems={3} />);

    await user.click(screen.getByRole("button", { name: "Go to page 3" }));
    await screen.findByText("Updated");
    rerender(<DataTable {...props} numberOfItems={1} />);

    await waitFor(() => expect(requestItems).toHaveBeenCalledWith(0, 1));
    expect(
      screen.getByRole("navigation", { name: "Table pagination" }),
    ).toHaveTextContent("1");
  });

  it("sorts stably and cycles through ascending, descending, and reset", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        numberOfItems={3}
        header={headers}
        initialItems={[
          { name: "Bea", age: 2 },
          { name: "Ada", age: 2 },
          { name: "Cal", age: 1 },
        ]}
        renderCell={renderPerson}
        requestItems={vi.fn()}
        getSortValue={getPersonSortValue}
        defaultSort={null}
      />,
    );

    const nameHeader = screen.getByRole("columnheader", { name: /Name/ });
    const sortButton = within(nameHeader).getByRole("button");

    await user.click(sortButton);
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    expect(within(screen.getByRole("table")).getAllByRole("row")[1]).toHaveTextContent(
      "Ada",
    );

    await user.click(sortButton);
    expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    expect(within(screen.getByRole("table")).getAllByRole("row")[1]).toHaveTextContent(
      "Cal",
    );

    await user.click(sortButton);
    expect(nameHeader).not.toHaveAttribute("aria-sort");
  });

  it("keeps controlled sorting authoritative", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    const rows = [
      { name: "Ada", age: 1 },
      { name: "Bea", age: 2 },
    ];
    const { rerender } = render(
      <DataTable
        numberOfItems={2}
        header={headers}
        initialItems={rows}
        renderCell={renderPerson}
        requestItems={vi.fn()}
        getSortValue={getPersonSortValue}
        sort={{ columnIndex: 0, direction: "desc" }}
        onSortChange={onSortChange}
      />,
    );

    const nameHeader = screen.getByRole("columnheader", { name: /Name/ });
    await user.click(within(nameHeader).getByRole("button"));
    expect(onSortChange).toHaveBeenCalledWith(null);
    expect(nameHeader).toHaveAttribute("aria-sort", "descending");

    rerender(
      <DataTable
        numberOfItems={2}
        header={headers}
        initialItems={rows}
        renderCell={renderPerson}
        requestItems={vi.fn()}
        getSortValue={getPersonSortValue}
        sort={null}
        onSortChange={onSortChange}
      />,
    );
    expect(nameHeader).not.toHaveAttribute("aria-sort");
  });

  it("does not enable sorting unless sort state is configured", () => {
    render(
      <DataTable
        numberOfItems={1}
        header={headers}
        initialItems={[{ name: "Ada", age: 1 }]}
        renderCell={renderPerson}
        requestItems={vi.fn()}
        getSortValue={getPersonSortValue}
      />,
    );

    expect(screen.queryByRole("button", { name: /Name/ })).toBeNull();
  });

  it("searches case-insensitively, trims the query, and supports empty results", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        numberOfItems={3}
        header={headers}
        initialItems={[
          { name: "Ada Lovelace", age: 36 },
          { name: "Grace Hopper", age: 85 },
          { name: "Alan Turing", age: 41 },
        ]}
        renderCell={renderPerson}
        requestItems={vi.fn()}
        searchable
        getSearchValue={getPersonSearchValue}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: "Search table" }), "  GRACE ");
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
    expect(screen.queryByText("Ada Lovelace")).toBeNull();

    await user.clear(screen.getByRole("textbox", { name: "Search table" }));
    await user.type(screen.getByRole("textbox", { name: "Search table" }), "missing");
    expect(screen.getByText("No items found.")).toBeInTheDocument();
  });

  it("shows loading, reports errors, and retries failed requests", async () => {
    const user = userEvent.setup();
    const requestError = new Error("Network unavailable");
    const onError = vi.fn();
    const requestItems = vi
      .fn<() => Promise<Person[]>>()
      .mockRejectedValueOnce(requestError)
      .mockResolvedValueOnce([{ name: "Recovered", age: 12 }]);

    render(
      <DataTable
        numberOfItems={1}
        header={headers}
        renderCell={renderPerson}
        requestItems={requestItems}
        onError={onError}
      />,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Network unavailable",
    );
    expect(onError).toHaveBeenCalledWith(requestError);

    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByText("Recovered")).toBeInTheDocument();
    expect(requestItems).toHaveBeenCalledTimes(2);
  });

  it("does not allow stale page responses to replace the latest request", async () => {
    const user = userEvent.setup();
    const secondPage = createDeferred<Person[]>();
    const thirdPage = createDeferred<Person[]>();
    const requestItems = vi
      .fn<(start: number, end: number) => Promise<Person[]>>()
      .mockReturnValueOnce(secondPage.promise)
      .mockReturnValueOnce(thirdPage.promise);

    render(
      <DataTable
        numberOfItems={3}
        itemsPerPage={1}
        header={headers}
        initialItems={[{ name: "First", age: 1 }]}
        renderCell={renderPerson}
        requestItems={requestItems}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Go to page 2" }));
    await user.click(screen.getByRole("button", { name: "Go to page 3" }));
    await waitFor(() => expect(requestItems).toHaveBeenCalledTimes(2));

    await act(async () => {
      thirdPage.resolve([{ name: "Third", age: 3 }]);
    });
    expect(await screen.findByText("Third")).toBeInTheDocument();

    await act(async () => {
      secondPage.resolve([{ name: "Second", age: 2 }]);
    });
    expect(screen.getByText("Third")).toBeInTheDocument();
    expect(screen.queryByText("Second")).toBeNull();
  });

  it("does not update the component after unmounting during a request", async () => {
    const pending = createDeferred<Person[]>();
    const requestItems = vi.fn(() => pending.promise);
    const onError = vi.fn();
    const { unmount } = render(
      <DataTable
        numberOfItems={1}
        header={headers}
        renderCell={renderPerson}
        requestItems={requestItems}
        onError={onError}
      />,
    );

    await waitFor(() => expect(requestItems).toHaveBeenCalledTimes(1));
    unmount();
    await act(async () => {
      pending.resolve([{ name: "Too late", age: 1 }]);
    });

    expect(onError).not.toHaveBeenCalled();
  });

  it("renders empty content for zero items without requesting an empty range", async () => {
    const requestItems = vi.fn(async () => []);
    render(
      <DataTable
        numberOfItems={0}
        header={headers}
        renderCell={renderPerson}
        requestItems={requestItems}
        noContent={<span>Nothing here</span>}
      />,
    );

    expect(await screen.findByText("Nothing here")).toBeInTheDocument();
    expect(requestItems).not.toHaveBeenCalled();
  });

  it("rejects invalid counts, page sizes, column sizes, and cell lengths", () => {
    const commonProps = {
      header: headers,
      renderCell: renderPerson,
      requestItems: vi.fn(async () => []),
    };

    expect(() =>
      renderToString(<DataTable {...commonProps} numberOfItems={-1} />),
    ).toThrow(RangeError);
    expect(() =>
      renderToString(
        <DataTable {...commonProps} numberOfItems={1} itemsPerPage={0} />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      renderToString(
        <DataTable
          {...commonProps}
          numberOfItems={1}
          columnSizes={[100]}
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      renderToString(
        <DataTable
          {...commonProps}
          numberOfItems={1}
          initialItems={[{ name: "Ada", age: 1 }]}
          renderCell={() => ["only one"]}
        />,
      ),
    ).toThrow(RangeError);
  });
});
