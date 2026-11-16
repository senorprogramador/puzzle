import type { AuthDatabase } from "../types";

export const getInitialUserTemplate = (database: Exclude<AuthDatabase, "custom">) => `import { StorageAuthManager, StorageRateLimitProvider${database === "d1" ? ", Pbkdf2PasswordHasher" : ""} } from "@puzzle-ui/auth";
import { StorageSessionManager } from "@puzzle-ui/session";
${database === "mongodb" ? `import { MongoClient } from "mongodb";
import { MongoStorageAdapter } from "@puzzle-ui/storage-mongodb";
import { hash, verify } from "@node-rs/argon2";` : `import { getPlatformProxy } from "wrangler";
import { D1StorageAdapter } from "@puzzle-ui/storage-d1";`}

// Credentials arrive over stdin, never through argv, source files, or .env.
let credentials = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) {
  credentials += chunk;
}
const input = JSON.parse(credentials);
if (!input || typeof input.email !== "string" || typeof input.password !== "string") {
  throw new Error("Initial user credentials must include email and password.");
}
process.loadEnvFile();

${database === "mongodb" ? `const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const storage = new MongoStorageAdapter({
  database: client.db(process.env.MONGODB_DATABASE),
  client,
  transactionsEnabled: true,
});
const parameters = { memoryCost: 65536, timeCost: 3, parallelism: 1 };
const passwordHasher = {
  hash: async (password) => ({
    hash: await hash(password, parameters),
    algorithm: "argon2id",
    parameters,
  }),
  verify: (password, stored) => verify(stored.hash, password),
};` : `// Use the same persisted local D1 database as dev and preview, never remote D1.
const platform = await getPlatformProxy({ persist: { path: ".wrangler/state/v3" } });
const storage = new D1StorageAdapter({ database: platform.env.DB });
const pepperHex = process.env.AUTH_PASSWORD_PEPPER_HEX ?? "";
if (!/^[a-f0-9]{64}$/i.test(pepperHex)) {
  await platform.dispose();
  throw new Error("AUTH_PASSWORD_PEPPER_HEX must encode exactly 32 bytes.");
}
const pepper = Uint8Array.from(pepperHex.match(/.{2}/g), (byte) => Number.parseInt(byte, 16));
const passwordHasher = new Pbkdf2PasswordHasher({ pepper });`}

try {
  const sessions = new StorageSessionManager(storage);
  const rateLimitProvider = new StorageRateLimitProvider(storage);
  const auth = new StorageAuthManager(
    { storage, sessions, rateLimitProvider, passwordHasher },
    { rateLimitKeySecret: process.env.AUTH_RATE_LIMIT_SECRET, minimumPasswordLength: 12 },
  );

  await sessions.initialize();
  await rateLimitProvider.initialize();
  await auth.initialize();

  // Refuse to overwrite an existing account or silently reset its password.
  const result = await auth.register({
    email: input.email,
    password: input.password,
    ipAddress: "127.0.0.1",
  });
  await auth.signOutEverywhere(result.user.id);
  console.log("Initial application user created. Sign in at /sign-in.");
} finally {
  ${database === "mongodb" ? "await client.close();" : "await platform.dispose();"}
}
`;
