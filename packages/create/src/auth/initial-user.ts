import * as p from "@clack/prompts";

export type InitialUser = {
  email: string;
  password: string;
};

export const promptInitialUser = async (): Promise<InitialUser | null> => {
  p.log.info(
    "Create the first application sign-in account in your local database. MongoDB setup requires Docker. Puzzle Auth has no administrator roles; MongoDB administrator credentials remain separate.",
  );

  const email = await p.text({
    message: "Email for the first application user:",
    validate: (value) =>
      !value || value.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? "Enter a valid email address."
        : undefined,
  });

  if (p.isCancel(email)) return null;

  const password = await p.password({
    message: "Password for the first application user:",
    validate: (value) => {
      const length = Array.from(value ?? "").length;

      if (length < 12 || length > 1024 || new TextEncoder().encode(value).length > 4096) {
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

  return { email: email.trim().toLowerCase(), password };
};
