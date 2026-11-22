import type {
  CloudflareMediaMetadataStore,
  CloudflareObjectRecord,
  CloudflareUploadRecord,
} from "./types";

const cloneSession = (record: CloudflareUploadRecord): CloudflareUploadRecord => ({
  ...record,
  session: {
    ...record.session,
    expiresAt: new Date(record.session.expiresAt),
    ...(record.session.uploadTarget
      ? {
          uploadTarget: {
            ...record.session.uploadTarget,
            expiresAt: new Date(record.session.uploadTarget.expiresAt),
            headers: { ...record.session.uploadTarget.headers },
          },
        }
      : {}),
  },
});

const cloneObject = (record: CloudflareObjectRecord): CloudflareObjectRecord => ({
  ...record,
  object: {
    ...record.object,
    object: { ...record.object.object },
    createdAt: new Date(record.object.createdAt),
  },
});

/**
 * An in-memory metadata store for tests and local development. Production
 * deployments should provide a durable implementation backed by D1, Durable
 * Objects, or another transactional store.
 */
export class InMemoryCloudflareMediaMetadataStore
  implements CloudflareMediaMetadataStore
{
  private readonly uploads = new Map<string, CloudflareUploadRecord>();
  private readonly objects = new Map<string, CloudflareObjectRecord>();

  async saveUpload(record: CloudflareUploadRecord): Promise<void> {
    this.uploads.set(record.session.id, cloneSession(record));
  }

  async getUpload(id: string): Promise<CloudflareUploadRecord | null> {
    const record = this.uploads.get(id);
    return record ? cloneSession(record) : null;
  }

  async updateUpload(
    id: string,
    update: Partial<Pick<CloudflareUploadRecord, "session">>,
  ): Promise<CloudflareUploadRecord | null> {
    const current = this.uploads.get(id);
    if (!current) return null;
    const next = { ...current, ...(update.session ? { session: update.session } : {}) };
    this.uploads.set(id, cloneSession(next));
    return cloneSession(next);
  }

  async listExpiredUploads(
    before: Date,
    first: number,
    tenantId?: string,
  ): Promise<readonly CloudflareUploadRecord[]> {
    return [...this.uploads.values()]
      .filter(
        (record) =>
          (!tenantId || record.tenantId === tenantId) &&
          (record.session.state === "pending" || record.session.state === "expired") &&
          record.session.expiresAt.getTime() <= before.getTime(),
      )
      .sort(
        (left, right) =>
          left.session.expiresAt.getTime() - right.session.expiresAt.getTime(),
      )
      .slice(0, first)
      .map(cloneSession);
  }

  async saveObject(record: CloudflareObjectRecord): Promise<void> {
    this.objects.set(record.key, cloneObject(record));
  }

  async getObject(key: string, tenantId?: string): Promise<CloudflareObjectRecord | null> {
    const record = this.objects.get(key);
    if (!record || (tenantId && record.object.tenantId !== tenantId)) return null;
    return cloneObject(record);
  }

  async deleteObject(key: string, tenantId?: string): Promise<boolean> {
    const record = await this.getObject(key, tenantId);
    return record ? this.objects.delete(key) : false;
  }

  async listObjects(input: {
    readonly first: number;
    readonly cursor?: string;
    readonly olderThan?: Date;
    readonly tenantId?: string;
  }): Promise<readonly CloudflareObjectRecord[]> {
    const records = [...this.objects.values()]
      .filter(
        (record) =>
          (!input.tenantId || record.object.tenantId === input.tenantId) &&
          (!input.olderThan ||
            record.object.createdAt.getTime() < input.olderThan.getTime()),
      )
      .sort((left, right) => left.key.localeCompare(right.key));
    const start = input.cursor
      ? records.findIndex((record) => record.key > input.cursor!)
      : 0;
    return (start < 0 ? [] : records.slice(start, start + input.first)).map(cloneObject);
  }
}
