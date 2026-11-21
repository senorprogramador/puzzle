const hex = (bytes: ArrayBuffer) =>
  [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

const base64 = (bytes: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)));

const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
};

export const verifyHmacSha256 = async ({
  payload,
  signature,
  secret,
  encoding = "hex",
}: {
  payload: string;
  signature: string;
  secret: string;
  encoding?: "hex" | "base64";
}): Promise<boolean> => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return timingSafeEqual(encoding === "base64" ? base64(digest) : hex(digest), signature);
};

export const verifyStripeSignature = async ({
  payload,
  signature,
  secret,
  toleranceSeconds = 300,
  nowSeconds = Math.floor(Date.now() / 1000),
}: {
  payload: string;
  signature: string;
  secret: string;
  toleranceSeconds?: number;
  nowSeconds?: number;
}): Promise<boolean> => {
  const values = new Map<string, string[]>();
  for (const part of signature.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key && value) values.set(key, [...(values.get(key) ?? []), value]);
  }
  const timestamp = Number(values.get("t")?.[0]);
  if (!Number.isSafeInteger(timestamp) || Math.abs(nowSeconds - timestamp) > toleranceSeconds) {
    return false;
  }
  const expected = await Promise.all(
    (values.get("v1") ?? []).map((candidate) =>
      verifyHmacSha256({
        payload: `${timestamp}.${payload}`,
        signature: candidate,
        secret,
        encoding: "hex",
      }),
    ),
  );
  return expected.some(Boolean);
};
