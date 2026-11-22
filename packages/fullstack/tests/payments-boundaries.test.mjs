import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readDist = (path) =>
  readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");

test("payment shared contracts stay runtime- and server-independent", async () => {
  const [sharedJs, sharedDts] = await Promise.all([
    readDist("payments/shared/index.js"),
    readDist("payments/shared/index.d.ts"),
  ]);

  assert.doesNotMatch(sharedJs, /@puzzle-ui\/commerce|payments\/server|node:/);
  assert.doesNotMatch(
    sharedDts,
    /PaymentServer|PaymentStore|ProviderRegistry|IdempotencyStore/,
  );
});

test("payment server entry does not import browser-only dependencies", async () => {
  const source = await readDist("payments/server/index.js");

  assert.doesNotMatch(
    source,
    /@puzzle-ui\/ui|react-dom|@simplewebauthn\/browser|payments\/client|node:/,
  );
});
