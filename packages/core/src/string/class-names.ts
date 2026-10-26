/**
 * Represents a valid argument for the `classNames` function.
 * It can be a string, an array of strings, undefined, null, or false.
 */
export type ClassnameArg = string | string[] | undefined | null | false;

/**
 * Concatenates and trims the given arguments into a single string of class names.
 *
 * @param args - The arguments to be concatenated.
 * @returns A string of class names.
 */
export const cn = (...args: ClassnameArg[]): string => {
  const notNullUndefinedOrFalse = args.filter((v) => !!v).flat() as string[];
  return notNullUndefinedOrFalse
    .flatMap((v) => v.split(" "))
    .filter((v) => v.length > 0)
    .join(" ")
    .trim();
};
