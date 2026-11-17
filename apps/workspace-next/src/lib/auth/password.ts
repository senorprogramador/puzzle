import { hash, verify } from "@node-rs/argon2";
import type { PasswordHasher } from "@puzzle-ui/auth";

// @node-rs/argon2 uses Argon2id by default.
const parameters = { memoryCost: 65536, timeCost: 3, parallelism: 1 };

const passwordHasher: PasswordHasher = {
  async hash(password) {
    return {
      hash: await hash(password, parameters),
      algorithm: "argon2id",
      parameters,
    };
  },
  verify: (password, stored) =>
    stored.hash.startsWith("$argon2id$")
      ? verify(stored.hash, password)
      : Promise.resolve(false),
};

export const createPasswordHasher = (): PasswordHasher => passwordHasher;
