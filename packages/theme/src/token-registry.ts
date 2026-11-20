import { stringWithCasing } from "@puzzle-ui/core";
import { DEFAULT_TOKENS } from "./constants";
import { DEFAULT_TYPOGRAPHY_ROLES } from "./fonts/typography";
import type {
  ThemeTokens,
  ThemeTypographyRoleTokens,
  TypographyStyle,
} from "./types";

type NonColorThemeTokens = Omit<ThemeTokens, "colorSchemes">;

type TypographyTokenGroup =
  | "typography.fontSize"
  | "typography.fontWeight"
  | "typography.lineHeight"
  | "typography.letterSpacing"
  | "typography.fontGap";

type TypographyRoleGroup = `typography.roles.${TypographyStyle}`;

export type ThemeTokenGroup =
  | TypographyTokenGroup
  | TypographyRoleGroup
  | Exclude<keyof NonColorThemeTokens, "typography">;

type ThemeTokenGroupValues<Group extends ThemeTokenGroup> =
  Group extends `typography.roles.${TypographyStyle}`
    ? Omit<ThemeTypographyRoleTokens, "font">
    : Group extends `typography.${infer GroupName}`
      ? NonColorThemeTokens["typography"][GroupName &
          keyof NonColorThemeTokens["typography"]]
      : Group extends "overlays"
        ? Omit<NonColorThemeTokens["overlays"], "backdrop">
        : Group extends keyof NonColorThemeTokens
          ? NonColorThemeTokens[Group]
          : never;

type ThemeTokenName<Group extends ThemeTokenGroup> =
  `${Extract<keyof ThemeTokenGroupValues<Group>, string | number>}`;

export type ThemeTokenInputKind = "dimension" | "number" | "duration";

export type ThemeTokenRegistryEntry = {
  [Group in ThemeTokenGroup]: {
    group: Group;
    name: ThemeTokenName<Group>;
    cssVariable: `--puzzle-${string}`;
    defaultValue: string;
    inputKind?: ThemeTokenInputKind;
  };
}[ThemeTokenGroup];

const TYPOGRAPHY_VARIABLE_PREFIXES = {
  fontSize: "font-size",
  fontWeight: "font-weight",
  lineHeight: "font-line-height",
  letterSpacing: "font-letter-spacing",
  fontGap: "font-gap",
} as const;

const TYPOGRAPHY_ROLE_VARIABLE_PREFIXES = {
  fontSize: "font-size",
  fontWeight: "font-weight",
  lineHeight: "font-line-height",
  letterSpacing: "font-letter-spacing",
} as const;

const GROUP_VARIABLE_PREFIXES = {
  spacing: "space",
  radius: "radius",
  shadows: "shadow",
  elevation: "elevation",
  breakpoints: "breakpoint",
  overlays: "overlay",
  zIndex: "z-index",
} as const;

const SPECIAL_VARIABLES: Record<string, string> = {
  "borders.width": "--puzzle-border-width",
  "borders.widthStrong": "--puzzle-border-width-strong",
  "borders.style": "--puzzle-border-style",
  "layout.container": "--puzzle-container-width",
  "layout.content": "--puzzle-content-width",
  "layout.prose": "--puzzle-prose-width",
  "motion.fast": "--puzzle-duration-fast",
  "motion.normal": "--puzzle-duration-normal",
  "motion.slow": "--puzzle-duration-slow",
  "motion.easingStandard": "--puzzle-easing-standard",
  "motion.easingIn": "--puzzle-easing-in",
  "motion.easingOut": "--puzzle-easing-out",
};

const getInputKind = (
  group: ThemeTokenGroup,
  name: string,
): ThemeTokenInputKind | undefined => {
  if (group.startsWith("typography.roles.")) {
    if (name === "fontWeight" || name === "lineHeight") return "number";
    if (name === "fontSize" || name === "letterSpacing") return "dimension";
  }

  if (group === "typography.fontWeight" || group === "typography.lineHeight") {
    return "number";
  }

  if (group === "typography.fontSize" || group === "typography.letterSpacing") {
    return "dimension";
  }

  if (group === "typography.fontGap") return "dimension";

  if (group === "spacing" || group === "radius" || group === "breakpoints") {
    return "dimension";
  }

  if (group === "borders" && name !== "style") return "dimension";
  if (group === "layout" || (group === "overlays" && name === "backdropBlur")) {
    return "dimension";
  }

  if (group === "motion" && ["fast", "normal", "slow"].includes(name)) {
    return "duration";
  }

  if (group === "zIndex") return "number";
};

const createEntry = (
  group: ThemeTokenGroup,
  name: string,
  defaultValue: string,
  cssVariable: string,
): ThemeTokenRegistryEntry => {
  const inputKind = getInputKind(group, name);

  return {
    group,
    name,
    cssVariable: cssVariable as `--puzzle-${string}`,
    defaultValue,
    ...(inputKind === undefined ? {} : { inputKind }),
  } as ThemeTokenRegistryEntry;
};

const entries: ThemeTokenRegistryEntry[] = [];

for (const [group, values] of Object.entries(DEFAULT_TOKENS)) {
  if (group === "colorSchemes") continue;

  if (group === "typography") {
    for (const [subgroup, subgroupValues] of Object.entries(values)) {
      const prefix =
        TYPOGRAPHY_VARIABLE_PREFIXES[
          subgroup as keyof typeof TYPOGRAPHY_VARIABLE_PREFIXES
        ];

      if (!prefix || typeof subgroupValues !== "object" || !subgroupValues) {
        continue;
      }

      for (const [name, defaultValue] of Object.entries(subgroupValues)) {
        entries.push(
          createEntry(
            `typography.${subgroup}` as ThemeTokenGroup,
            name,
            defaultValue as string,
            `--puzzle-${prefix}-${stringWithCasing(name, "kebabcase")}`,
          ),
        );
      }
    }

    continue;
  }

  if (typeof values !== "object" || !values) continue;

  for (const [name, defaultValue] of Object.entries(values)) {
    if (group === "overlays" && name === "backdrop") continue;

    const specialVariable = SPECIAL_VARIABLES[`${group}.${name}`];
    const prefix =
      GROUP_VARIABLE_PREFIXES[
        group as keyof typeof GROUP_VARIABLE_PREFIXES
      ];

    if (!specialVariable && !prefix) continue;

    entries.push(
      createEntry(
        group as ThemeTokenGroup,
        name,
        defaultValue as string,
        specialVariable ??
          `--puzzle-${prefix}-${stringWithCasing(name, "kebabcase")}`,
      ),
    );
  }
}

for (const [role, values] of Object.entries(DEFAULT_TYPOGRAPHY_ROLES)) {
  for (const [name, prefix] of Object.entries(
    TYPOGRAPHY_ROLE_VARIABLE_PREFIXES,
  )) {
    const defaultValue = values[name as keyof typeof values];

    entries.push(
      createEntry(
        `typography.roles.${role}` as ThemeTokenGroup,
        name,
        defaultValue,
        `--puzzle-${prefix}-${role}`,
      ),
    );
  }
}

export const THEME_TOKEN_REGISTRY: readonly ThemeTokenRegistryEntry[] =
  Object.freeze(entries.map((entry) => Object.freeze(entry)));
