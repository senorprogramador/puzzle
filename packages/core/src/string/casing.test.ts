import { describe, expect, it } from "vitest";

import { stringWithCasing } from "./casing";

describe("stringWithCasing", () => {
  it.each([
    ["lowercase", "hello world"],
    ["uppercase", "HELLO WORLD"],
    ["snakecase", "hello_world"],
    ["kebabcase", "hello-world"],
    ["camelcase", "helloWorld"],
    ["pascalcase", "HelloWorld"],
    ["sentencecase", "Hello world"],
    ["headercase", "Hello World"],
  ] as const)("converts words to %s", (casing, expected) => {
    expect(stringWithCasing("  hello world  ", casing)).toBe(expected);
  });

  it("normalizes mixed delimiters for identifier casings", () => {
    const mixed = "fooBar/baz-qux_word";

    expect(stringWithCasing(mixed, "snakecase")).toBe("foo_barbaz_quxword");
    expect(stringWithCasing(mixed, "kebabcase")).toBe("foo-bar-baz-qux-word");
    expect(stringWithCasing(mixed, "camelcase")).toBe("fooBarbazQuxword");
    expect(stringWithCasing(mixed, "pascalcase")).toBe("FooBarbazQuxword");
  });
});
