import {
  CloudflareMediaConfigurationError,
  CloudflareMediaValidationError,
} from "./errors";
import type {
  CloudflareR2BucketInfo,
  CloudflareR2BucketProvisionerApi,
  CloudflareR2BucketProvisionerOptions,
} from "./types";
import { validateTenantId } from "./utils";

const bucketNamePattern = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

/**
 * Provisions R2 buckets through an injected Cloudflare API client. Cloudflare
 * account authentication and the exact REST API transport remain application
 * concerns, so the package intentionally accepts this narrow interface.
 */
export class CloudflareR2BucketProvisioner {
  private readonly api: CloudflareR2BucketProvisionerApi;
  private readonly nameForTenant: (tenantId: string) => string;

  constructor(options: CloudflareR2BucketProvisionerOptions) {
    this.api = options.api;
    this.nameForTenant =
      options.nameForTenant ??
      ((tenantId) => `puzzle-${tenantId.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`);
  }

  async ensureBucket(input: {
    readonly tenantId: string;
    readonly name?: string;
    readonly locationHint?: string;
  }): Promise<CloudflareR2BucketInfo> {
    validateTenantId(input.tenantId);
    const name = input.name ?? this.nameForTenant(input.tenantId);
    if (!bucketNamePattern.test(name)) {
      throw new CloudflareMediaValidationError(
        "R2 bucket names must be 3-63 lowercase characters, numbers, or hyphens.",
      );
    }
    const existing = await this.api.getBucket(name);
    if (existing) return existing;
    try {
      return await this.api.createBucket({
        name,
        ...(input.locationHint ? { locationHint: input.locationHint } : {}),
      });
    } catch (error) {
      const raced = await this.api.getBucket(name);
      if (raced) return raced;
      throw new CloudflareMediaConfigurationError(
        `Unable to provision R2 bucket "${name}".`,
      );
    }
  }
}
