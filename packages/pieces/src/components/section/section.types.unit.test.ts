import { expectTypeOf, it } from "vitest";
import type {
  ContainerProps,
  SectionHeaderAlignment,
  SectionTheme,
} from "@puzzle-ui/ui";
import type {
  SectionAlignment,
  SectionContentWidth,
  SectionRootProps,
  SectionTheme as PiecesSectionTheme,
} from "./section.types";

it("reuses UI section and container types for shared section contracts", () => {
  expectTypeOf<SectionRootProps<"article">["as"]>().toEqualTypeOf<
    "article" | undefined
  >();
  expectTypeOf<SectionRootProps<"article">["aria-labelledby"]>().toEqualTypeOf<
    string | undefined
  >();
  expectTypeOf<SectionRootProps<"article">["theme"]>().toEqualTypeOf<
    SectionTheme | undefined
  >();
  expectTypeOf<SectionContentWidth>().toEqualTypeOf<
    NonNullable<ContainerProps["widthPreset"]>
  >();
  expectTypeOf<PiecesSectionTheme>().toEqualTypeOf<SectionTheme>();
  expectTypeOf<SectionAlignment>().toEqualTypeOf<SectionHeaderAlignment>();
});

it("keeps semantic element attributes specific to the selected root", () => {
  const articleProps: SectionRootProps<"article"> = {
    as: "article",
    "aria-label": "Article section",
  };
  const buttonProps: SectionRootProps<"button"> = {
    as: "button",
    type: "button",
  };

  expectTypeOf(articleProps.as).toEqualTypeOf<"article" | undefined>();
  expectTypeOf(buttonProps.type).toEqualTypeOf<
    "button" | "submit" | "reset" | undefined
  >();

  const invalidButtonProps: SectionRootProps<"button"> = {
    as: "button",
    // @ts-expect-error Buttons do not support link destinations.
    href: "/not-a-button-attribute",
  };
  expectTypeOf(invalidButtonProps).toMatchTypeOf<SectionRootProps<"button">>();
});
