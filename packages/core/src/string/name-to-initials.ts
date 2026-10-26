const NAME_PARTICLES = new Set([
  // Dutch
  "van",
  "den",
  "der",
  "de",
  "ter",
  "ten",
  "te",
  "het",
  "'t",

  // German
  "von",
  "vom",
  "zum",
  "zur",
  "zu",

  // French
  "du",
  "des",
  "le",
  "la",
  "les",

  // Spanish and Portuguese
  "del",
  "los",
  "las",
  "da",
  "das",
  "do",
  "dos",

  // Italian
  "di",
  "della",
  "delle",
  "dello",
  "dei",
  "degli",

  // Other common particles
  "al",
  "el",
  "bin",
  "ibn",
  "bint",
  "af",
  "av",
  "ap",
  "ab",
]);

const NAME_SUFFIXES = new Set([
  "jr",
  "sr",
  "ii",
  "iii",
  "iv",
  "v",
  "phd",
  "md",
]);

const normalizeNamePart = (part: string): string => {
  return part.toLocaleLowerCase().replace(/[\p{P}\p{S}]/gu, "");
};

const getFirstLetter = (part: string): string => {
  return part.match(/\p{L}/u)?.[0].toLocaleUpperCase() ?? "";
};

export const nameToInitials = (name: string) => {
  const parts = name.trim().split(/\s+/u).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }

  // Ignore suffixes such as Jr., Sr. and III.
  while (
    parts.length > 1 &&
    NAME_SUFFIXES.has(normalizeNamePart(parts[parts.length - 1]))
  ) {
    parts.pop();
  }

  const firstInitial = getFirstLetter(parts[0]);

  if (parts.length === 1) {
    return firstInitial;
  }

  // Find the last meaningful surname part, ignoring particles.
  const surname = [...parts.slice(1)]
    .reverse()
    .find((part) => !NAME_PARTICLES.has(normalizeNamePart(part)));

  // Fallback for unusual names consisting only of particles.
  const lastInitial = getFirstLetter(surname ?? parts[parts.length - 1]);

  return firstInitial + lastInitial;
};
