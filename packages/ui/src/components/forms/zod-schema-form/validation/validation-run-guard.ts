export interface ValidationRunGuard {
  /**
   * Starts a run and returns its revision. Only the most recently started run
   * remains current.
   */
  startRun(): number;
  /** Invalidates pending runs after values or the schema change. */
  invalidate(): void;
  /** Checks whether a run's revision is still current. */
  isCurrent(revision: number): boolean;
}

export const createValidationRunGuard = (): ValidationRunGuard => {
  let revision = 0;

  return {
    startRun: () => {
      revision += 1;
      return revision;
    },
    invalidate: () => {
      revision += 1;
    },
    isCurrent: (runRevision) => runRevision === revision,
  };
};
