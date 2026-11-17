import { StorageAuthManager, StorageRateLimitProvider } from "@puzzle-ui/auth";
import { StorageSessionManager } from "@puzzle-ui/session";
import { MongoClient } from "mongodb";
import { MongoStorageAdapter } from "@puzzle-ui/storage-mongodb";
import { hash, verify } from "@node-rs/argon2";

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

const client = new MongoClient(process.env.MONGODB_URI);
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
};

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
  await client.close();
}
