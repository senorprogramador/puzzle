"use client";

import { useEffect, useId, useState } from "react";
import type { CmsValue } from "@puzzle-ui/cms";
import { Dialog } from "@puzzle-ui/ui";
import type { CmsRevisionItem, RevisionHistoryProps } from "./cms.types";
import { errorMessage, formatDate, dateTimeAttribute } from "./cms.utils";

const canonicalCmsValue = (value: CmsValue): string => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalCmsValue).join(",")}]`;
  return `{${Object.entries(value)
    .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
    .map(([key, item]) => `${JSON.stringify(key)}:${canonicalCmsValue(item)}`)
    .join(",")}}`;
};

const RevisionComparison = ({
  revision,
  current,
}: {
  revision: CmsRevisionItem;
  current: CmsRevisionItem;
}) => {
  const keys = [...new Set([...Object.keys(revision.fields), ...Object.keys(current.fields)])]
    .sort();
  const changes = keys.flatMap((key) => {
    const hadValue = Object.prototype.hasOwnProperty.call(revision.fields, key);
    const hasValue = Object.prototype.hasOwnProperty.call(current.fields, key);
    const before = revision.fields[key];
    const after = current.fields[key];
    if (
      hadValue === hasValue &&
      before !== undefined &&
      after !== undefined &&
      canonicalCmsValue(before) === canonicalCmsValue(after)
    ) return [];
    return [{ key, hadValue, hasValue, before, after }];
  });
  return (
    <details className="puzzle-cms-revisions__diff">
      <summary>
        Compare revision {revision.revisionNumber} with current revision {current.revisionNumber}
      </summary>
      {changes.length ? (
        <ul>
          {changes.map(({ key, hadValue, hasValue, before, after }) => (
            <li key={key}>
              <strong>{key}</strong>
              <div>
                <span>Revision {revision.revisionNumber}</span>
                <pre>{hadValue ? JSON.stringify(before, null, 2) : "Not present"}</pre>
              </div>
              <div>
                <span>Current revision {current.revisionNumber}</span>
                <pre>{hasValue ? JSON.stringify(after, null, 2) : "Not present"}</pre>
              </div>
            </li>
          ))}
        </ul>
      ) : <p>No field changes.</p>}
    </details>
  );
};

export const RevisionHistory = ({
  revisions,
  currentRevisionNumber,
  loading = false,
  error,
  confirmRestore = false,
  onRestore,
  className,
}: RevisionHistoryProps) => {
  const id = useId();
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [confirmRevisionId, setConfirmRevisionId] = useState<string | null>(null);
  const currentRevision = revisions.find(
    (revision) => revision.revisionNumber === currentRevisionNumber,
  );
  const confirmRevision = revisions.find((revision) => revision.id === confirmRevisionId);
  useEffect(() => {
    if (confirmRevisionId && !confirmRevision) setConfirmRevisionId(null);
  }, [confirmRevisionId, confirmRevision]);

  const restore = async (revision: CmsRevisionItem) => {
    if (!onRestore) return;
    setRestoringId(revision.id);
    setRestoreError(null);
    try {
      await onRestore(revision.id, revision.revisionNumber);
    } catch (restoreFailure) {
      setRestoreError(errorMessage(restoreFailure));
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <section
      className={["puzzle-cms-revisions", className].filter(Boolean).join(" ")}
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`}>Revision history</h2>
      {error ? <p role="alert">{error}</p> : null}
      {restoreError ? <p role="alert">{restoreError}</p> : null}
      {loading ? <p role="status">Loading revisions…</p> : null}
      {!loading && revisions.length === 0 ? <p>No revisions yet.</p> : null}
      <ol className="puzzle-cms-revisions__list">
        {revisions.map((revision) => (
          <li key={revision.id}>
            <div>
              <strong>Revision {revision.revisionNumber}</strong>
              <span>{revision.action.replaceAll("-", " ")}</span>
              {dateTimeAttribute(revision.createdAt) ? (
                <time dateTime={dateTimeAttribute(revision.createdAt)}>
                  {formatDate(revision.createdAt)}
                </time>
              ) : (
                <span>{formatDate(revision.createdAt)}</span>
              )}
              <span>{revision.actorId ?? "System"} · {revision.status}</span>
              {revision.changeSummary ? <p>{revision.changeSummary}</p> : null}
              <details>
                <summary>Preview revision fields</summary>
                <pre>{JSON.stringify(revision.fields, null, 2)}</pre>
              </details>
              {currentRevision && revision.id !== currentRevision.id ? (
                <RevisionComparison revision={revision} current={currentRevision} />
              ) : null}
            </div>
            {onRestore ? (
              <button
                type="button"
                aria-label={`Restore revision ${revision.revisionNumber} as new revision`}
                disabled={
                  restoringId !== null ||
                  revision.revisionNumber === currentRevisionNumber
                }
                onClick={() => {
                  if (confirmRestore) setConfirmRevisionId(revision.id);
                  else void restore(revision);
                }}
              >
                {restoringId === revision.id ? "Restoring…" : "Restore as new revision"}
              </button>
            ) : null}
          </li>
        ))}
      </ol>
      {confirmRestore && onRestore ? (
        <Dialog
          open={Boolean(confirmRevision)}
          onOpenChange={(open) => {
            if (!open) setConfirmRevisionId(null);
          }}
          title="Restore this revision?"
          description={
            confirmRevision
              ? `Revision ${confirmRevision.revisionNumber} will be restored as a new revision.`
              : undefined
          }
          footer={
            <>
              <button type="button" onClick={() => setConfirmRevisionId(null)}>Cancel</button>
              <button
                type="button"
                disabled={
                  !confirmRevision ||
                  restoringId !== null ||
                  confirmRevision.revisionNumber === currentRevisionNumber
                }
                onClick={() => {
                  if (!confirmRevision) return;
                  setConfirmRevisionId(null);
                  void restore(confirmRevision);
                }}
              >
                Restore revision
              </button>
            </>
          }
        />
      ) : null}
    </section>
  );
};
