import type {
  CloudflareMediaUrlSigner,
  CloudflareMediaUrlTarget,
  CloudflareR2S3UrlSignerOptions,
} from "./types";

const encoder = new TextEncoder();

const encode = (value: string): string =>
  encodeURIComponent(value).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );

const hex = (bytes: ArrayBuffer): string =>
  [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const sha256Hex = async (value: string): Promise<string> =>
  hex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));

const hmac = async (
  key: ArrayBuffer | Uint8Array,
  value: string,
): Promise<ArrayBuffer> => {
  const rawKey =
    key instanceof Uint8Array ? key.slice().buffer : key.slice(0);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(value));
};

const pathFor = (base: URL, bucketName: string, key: string): string => {
  const segments = [
    ...base.pathname.split("/").filter(Boolean),
    bucketName,
    ...key.split("/"),
  ];
  return `/${segments.map(encode).join("/")}`;
};

const formatDate = (date: Date): { dateStamp: string; amzDate: string } => {
  const iso = date.toISOString().replace(/\.\d{3}Z$/, "Z");
  return {
    dateStamp: iso.slice(0, 10).replaceAll("-", ""),
    amzDate: iso.replaceAll("-", "").replaceAll(":", ""),
  };
};

const canonicalQuery = (
  values: Readonly<Record<string, string>>,
): string =>
  Object.entries(values)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${encode(key)}=${encode(value)}`)
    .join("&");

/**
 * Worker-compatible AWS Signature Version 4 presigner for R2's
 * S3-compatible endpoint. Credentials stay in the server/Worker that creates
 * the signer; only the resulting short-lived target is returned to callers.
 */
export class CloudflareR2S3UrlSigner implements CloudflareMediaUrlSigner {
  private readonly endpoint: URL;
  private readonly bucketName: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly region: string;
  private readonly now: () => Date;

  constructor(options: CloudflareR2S3UrlSignerOptions) {
    this.endpoint = new URL(options.endpoint);
    if (this.endpoint.protocol !== "https:") {
      throw new TypeError("R2 S3 endpoints must use HTTPS.");
    }
    if (!options.bucketName || !options.accessKeyId || !options.secretAccessKey) {
      throw new TypeError("R2 S3 signing requires a bucket and access credentials.");
    }
    this.bucketName = options.bucketName;
    this.accessKeyId = options.accessKeyId;
    this.secretAccessKey = options.secretAccessKey;
    this.region = options.region ?? "auto";
    this.now = options.now ?? (() => new Date());
  }

  signUpload(input: Parameters<CloudflareMediaUrlSigner["signUpload"]>[0]): Promise<CloudflareMediaUrlTarget> {
    return this.presign("PUT", input.key, input.expiresAt, {}, input.contentType);
  }

  signMultipartPart(
    input: Parameters<CloudflareMediaUrlSigner["signMultipartPart"]>[0],
  ): Promise<CloudflareMediaUrlTarget> {
    return this.presign("PUT", input.key, input.expiresAt, {
      partNumber: String(input.partNumber),
      uploadId: input.uploadId,
    });
  }

  signRead(
    input: Parameters<CloudflareMediaUrlSigner["signRead"]>[0],
  ): Promise<CloudflareMediaUrlTarget> {
    return this.presign("GET", input.key, input.expiresAt, {});
  }

  private async presign(
    method: "GET" | "PUT",
    key: string,
    expiresAt: Date,
    extraQuery: Readonly<Record<string, string>>,
    contentType?: string,
  ): Promise<CloudflareMediaUrlTarget> {
    const now = this.now();
    const ttlSeconds = Math.ceil((expiresAt.getTime() - now.getTime()) / 1000);
    if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > 604800) {
      throw new RangeError("R2 signed URL expiry must be between one second and seven days.");
    }
    const { dateStamp, amzDate } = formatDate(now);
    const path = pathFor(this.endpoint, this.bucketName, key);
    const query = {
      ...extraQuery,
      "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
      "X-Amz-Credential": `${this.accessKeyId}/${dateStamp}/${this.region}/s3/aws4_request`,
      "X-Amz-Date": amzDate,
      "X-Amz-Expires": String(ttlSeconds),
      "X-Amz-SignedHeaders": "host",
    };
    const queryString = canonicalQuery(query);
    const host = this.endpoint.host;
    const canonicalRequest = [
      method,
      path,
      queryString,
      `host:${host}\n`,
      "host",
      "UNSIGNED-PAYLOAD",
    ].join("\n");
    const scope = `${dateStamp}/${this.region}/s3/aws4_request`;
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      scope,
      await sha256Hex(canonicalRequest),
    ].join("\n");
    const dateKey = await hmac(encoder.encode(`AWS4${this.secretAccessKey}`), dateStamp);
    const regionKey = await hmac(dateKey, this.region);
    const serviceKey = await hmac(regionKey, "s3");
    const signingKey = await hmac(serviceKey, "aws4_request");
    const signature = hex(await hmac(signingKey, stringToSign));
    return {
      url: `${this.endpoint.origin}${path}?${queryString}&X-Amz-Signature=${signature}`,
      ...(method === "PUT" && contentType
        ? { headers: { "content-type": contentType } }
        : {}),
    };
  }
}

export { CloudflareR2S3UrlSigner as CloudflareR2S3Signer };
