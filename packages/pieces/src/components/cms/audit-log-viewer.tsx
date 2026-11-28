"use client";

import { useEffect, useId, useState } from "react";
import { Select } from "@puzzle-ui/ui";
import type { AuditLogViewerProps } from "./cms.types";
import { formatDate, dateTimeAttribute } from "./cms.utils";

export const AuditLogViewer = ({
  events,
  loading = false,
  error,
  pageSize = 10,
  className,
}: AuditLogViewerProps) => {
  const id = useId();
  const [resource, setResource] = useState("all");
  const [result, setResult] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    throw new RangeError("AuditLogViewer pageSize must be a positive integer.");
  }
  const resources = [...new Set(events.map((event) => event.resource))].sort();
  const filtered = events.filter((event) => {
    const haystack =
      `${event.actorId ?? ""} ${event.action} ${event.resourceId}`.toLocaleLowerCase();
    return (
      (resource === "all" || event.resource === resource) &&
      (result === "all" || event.result === result) &&
      haystack.includes(search.trim().toLocaleLowerCase())
    );
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  return (
    <section
      className={["puzzle-cms-audit", className].filter(Boolean).join(" ")}
      aria-labelledby={`${id}-title`}
    >
      <header>
        <h2 id={`${id}-title`}>Audit log</h2>
        <p>{filtered.length} events</p>
      </header>
      <div className="puzzle-cms-audit__filters">
        <label>
          Search
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Resource
          <Select
            aria-label="Resource"
            value={resource}
            options={[
              { value: "all", label: "All resources" },
              ...resources.map((item) => ({ value: item, label: item })),
            ]}
            onChange={(next) => {
              if (next === undefined) return;
              setResource(next);
              setPage(1);
            }}
          />
        </label>
        <label>
          Result
          <Select
            aria-label="Result"
            value={result}
            options={[
              { value: "all", label: "All results" },
              { value: "success", label: "Success" },
              { value: "denied", label: "Denied" },
              { value: "failure", label: "Failure" },
            ]}
            onChange={(next) => {
              if (next === undefined) return;
              setResult(next);
              setPage(1);
            }}
          />
        </label>
      </div>
      {error ? <p role="alert">{error}</p> : null}
      {loading ? <p role="status">Loading audit events…</p> : null}
      {!loading && visible.length === 0 ? <p>No audit events match these filters.</p> : null}
      {visible.length > 0 ? (
        <div className="puzzle-cms-audit__table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Actor</th>
                <th scope="col">Action</th>
                <th scope="col">Resource</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((event) => (
                <tr key={event.id}>
                  <td>
                    {dateTimeAttribute(event.timestamp) ? (
                      <time dateTime={dateTimeAttribute(event.timestamp)}>
                        {formatDate(event.timestamp)}
                      </time>
                    ) : (
                      formatDate(event.timestamp)
                    )}
                  </td>
                  <td>{event.actorId ?? "System"}</td>
                  <td>{event.action}</td>
                  <td>{event.resource}{event.resourceId ? ` · ${event.resourceId}` : ""}</td>
                  <td><span data-result={event.result}>{event.result}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {pageCount > 1 ? (
        <nav className="puzzle-cms-audit__pagination" aria-label="Audit log pages">
          <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {pageCount}</span>
          <button type="button" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</button>
        </nav>
      ) : null}
    </section>
  );
};
