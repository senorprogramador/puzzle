import { withSafeCharacters } from "./normalize";

/**
 * Represents the casing options for strings.
 * - "lowercase"      -> hello world
 * - "uppercase"      -> HELLO WORLD
 * - "snakecase"      -> hello_world
 * - "kebabcase"      -> hello-world
 * - "camelcase"      -> helloWorld
 * - "pascalcase"     -> HelloWorld
 * - "sentencecase"   -> Hello world
 * - "headercase"     -> Hello World
 **/
export type StringCasing =
  | "lowercase"
  | "uppercase"
  | "snakecase"
  | "kebabcase"
  | "camelcase"
  | "pascalcase"
  | "sentencecase"
  | "headercase";

/**
 * Transforms the input string into the specified casing.
 * Casing can be one of the following:
 * - "lowercase"      -> hello world
 * - "uppercase"      -> HELLO WORLD
 * - "snakecase"      -> hello_world
 * - "kebabcase"      -> hello-world
 * - "camelcase"      -> helloWorld
 * - "pascalcase"     -> HelloWorld
 * - "sentencecase"   -> Hello world
 * - "headercase"     -> Hello World
 **/
export const stringWithCasing = (
  input: string,
  casing: StringCasing,
): string => {
  const trimmedInput = input.trim();
  const cleanedInput = withSafeCharacters(trimmedInput);

  switch (casing) {
    case "lowercase":
      return trimmedInput.toLowerCase();
    case "uppercase":
      return trimmedInput.toUpperCase();
    case "snakecase":
      return cleanedInput
        .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
        .replace(/([a-z])([A-Z])/g, (_m, a, b) => a + "_" + b.toLowerCase())
        .replace(/[^A-Za-z0-9]+|_+/g, "_")
        .toLowerCase();
    case "kebabcase":
      return trimmedInput
        .replace(/^[^A-Za-z0-9]*-?|[^A-Za-z0-9]*-?$/g, "")
        .replace(/([a-z])([A-Z])/g, (_m, a, b) => `${a}_${b.toLowerCase()}`)
        .replace(/[^A-Za-z0-9]+|_+/g, "-")
        .toLowerCase();
    case "camelcase":
      return cleanedInput
        .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
        .replace(/[^A-Za-z0-9]+/g, "$")
        .replace(/([a-z])([A-Z])/g, (_m, a, b) => `${a}$${b}`)
        .toLowerCase()
        .replace(/(\$)(\w)/g, (_m, _a, b) => b.toUpperCase());
    case "pascalcase":
      return cleanedInput
        .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "$")
        .replace(/[^A-Za-z0-9]+/g, "$")
        .replace(/([a-z])([A-Z])/g, (_m, a, b) => `${a}$${b}`)
        .toLowerCase()
        .replace(/(\$)(\w?)/g, (_m, a, b) => b.toUpperCase());
    case "sentencecase": {
      const textcase = trimmedInput
        .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
        .replace(/([a-z])([A-Z])/g, (_m, a, b) => `${a}_${b.toLowerCase()}`)
        .replace(/[^A-Za-z0-9]+|_+/g, " ")
        .toLowerCase();

      return textcase.charAt(0).toUpperCase() + textcase.slice(1);
    }
    case "headercase":
      return trimmedInput
        .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
        .replace(/([a-z])([A-Z])/g, (_m, a, b) => `${a}_${b.toLowerCase()}`)
        .replace(/[^A-Za-z0-9]+|_+/g, " ")
        .toLowerCase()
        .replace(
          /( ?)(\w+)( ?)/g,
          (m, a, b, c) => a + b.charAt(0).toUpperCase() + b.slice(1) + c,
        );
  }
};
