import * as p from "@clack/prompts";

const MAX_STDIN_BYTES = 8192;

export type InitialUser = {
  email: string;
  password: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const validateInitialUser = (value: unknown): InitialUser => {
  if (!isRecord(value)) {
    throw new Error("Initial user credentials must be a JSON object.");
  }

  const unexpected = Object.keys(value).find(
    (key) => key !== "email" && key !== "password",
  );
  if (unexpected) {
    throw new Error(`Unsupported initial user credential field "${unexpected}".`);
  }

  const email = value.email;
  const password = value.password;
  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    throw new Error("Initial user email must be a valid email address.");
  }

  if (
    typeof password !== "string" ||
    Array.from(password).length < 12 ||
    Array.from(password).length > 1024 ||
    new TextEncoder().encode(password).length > 4096
  ) {
    throw new Error(
      "Initial user password must be 12 to 1024 characters and at most 4096 UTF-8 bytes.",
    );
  }

  return { email: email.trim().toLowerCase(), password };
};

export const readInitialUserFromStdin = async (
  input: AsyncIterable<string | Uint8Array> = process.stdin,
): Promise<InitialUser> => {
  let contents = "";
  let byteLength = 0;
  const textDecoder = new TextDecoder("utf-8", { fatal: true });

  for await (const chunk of input) {
    const bytes =
      typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk;
    byteLength += bytes.byteLength;
    if (byteLength > MAX_STDIN_BYTES) {
      throw new Error("Initial user credentials exceed the 8192-byte stdin limit.");
    }

    try {
      contents += textDecoder.decode(bytes, { stream: true });
    } catch {
      throw new Error("Initial user credentials on stdin must use valid UTF-8.");
    }
  }

  try {
    contents += textDecoder.decode();
  } catch {
    throw new Error("Initial user credentials on stdin must use valid UTF-8.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(contents);
  } catch {
    throw new Error(
      "Initial user credentials on stdin must be a JSON object with email and password fields.",
    );
  }

  return validateInitialUser(parsed);
};

export const promptInitialUser = async (): Promise<InitialUser | null> => {
  p.log.info(
    "Create the first application sign-in account in your local database. MongoDB setup requires Docker. Puzzle Auth has no administrator roles; MongoDB administrator credentials remain separate.",
  );

  const email = await p.text({
    message: "Email for the first application user:",
    validate: (value) =>
      typeof value !== "string" ||
      value.trim().length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? "Enter a valid email address."
        : undefined,
  });

  if (p.isCancel(email)) return null;

  const password = await p.password({
    message: "Password for the first application user:",
    validate: (value) => {
      const length = Array.from(value ?? "").length;

      if (
        length < 12 ||
        length > 1024 ||
        new TextEncoder().encode(value ?? "").length > 4096
      ) {
        return "Use between 12 and 1024 characters (at most 4096 UTF-8 bytes).";
      }
    },
  });

  if (p.isCancel(password)) return null;

  const confirmation = await p.password({
    message: "Confirm the password:",
    validate: (value) => value !== password ? "Passwords do not match." : undefined,
  });

  if (p.isCancel(confirmation)) return null;

  return validateInitialUser({ email, password });
};
