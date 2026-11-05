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
export type StringCasing = "lowercase" | "uppercase" | "snakecase" | "kebabcase" | "camelcase" | "pascalcase" | "sentencecase" | "headercase";
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
export declare const stringWithCasing: (input: string, casing: StringCasing) => string;
