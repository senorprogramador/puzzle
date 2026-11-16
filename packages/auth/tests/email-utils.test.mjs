import test from "node:test";
import assert from "node:assert/strict";

import {
  AuthValidationError,
  normalizeDisplayName,
  normalizeEmail,
} from "../dist/index.js";

test("trims and lowercases email addresses", () => {
  assert.equal(normalizeEmail("  USER.Name+tag@Example.COM  "), "user.name+tag@example.com");
  assert.equal(normalizeEmail(`${"a".repeat(250)}@b.c`).length, 254);
});

test("rejects malformed or oversized email addresses", () => {
  for (const email of [
    "",
    "   ",
    "missing-at.example.com",
    "missing-domain@",
    "missing-tld@example",
    "contains space@example.com",
    `${"a".repeat(251)}@b.c`,
  ]) {
    assert.throws(() => normalizeEmail(email), AuthValidationError, email);
  }
});

test("normalizes optional display names without changing email rules", () => {
  assert.equal(normalizeDisplayName("  Ada Lovelace  "), "Ada Lovelace");
  assert.equal(normalizeDisplayName("   "), null);
  assert.equal(normalizeDisplayName(undefined), null);
  assert.equal(normalizeDisplayName(null), null);
});
