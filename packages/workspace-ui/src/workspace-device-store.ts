export type LocalEntityChanges<T extends { readonly id: string }> = {
  readonly upserts: readonly T[];
  readonly deletedIds: readonly string[];
};

export const mergeLocalEntities = <T extends { readonly id: string }>(
  base: readonly T[],
  changes?: LocalEntityChanges<T>,
): readonly T[] => {
  if (!changes) return base;

  const entities = new Map(base.map((entity) => [entity.id, entity]));
  for (const id of changes.deletedIds) entities.delete(id);
  for (const entity of changes.upserts) entities.set(entity.id, entity);
  return [...entities.values()];
};

export const upsertLocalEntity = <T extends { readonly id: string }>(
  changes: LocalEntityChanges<T> | undefined,
  entity: T,
): LocalEntityChanges<T> => ({
  upserts: [
    ...(changes?.upserts.filter((item) => item.id !== entity.id) ?? []),
    entity,
  ],
  deletedIds: changes?.deletedIds.filter((id) => id !== entity.id) ?? [],
});

export const deleteLocalEntity = <T extends { readonly id: string }>(
  changes: LocalEntityChanges<T> | undefined,
  id: string,
): LocalEntityChanges<T> => ({
  upserts: changes?.upserts.filter((item) => item.id !== id) ?? [],
  deletedIds: [...new Set([...(changes?.deletedIds ?? []), id])],
});
