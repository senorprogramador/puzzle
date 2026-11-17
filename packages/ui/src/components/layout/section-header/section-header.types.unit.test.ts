import type { ElementType } from "react";
import { expectTypeOf, it } from "vitest";
import type { HeadingLevel } from "../../typography/heading";
import type {
  SectionHeaderAlignment,
  SectionHeaderProps,
} from "./section-header.types";

it("keeps heading semantics, visual levels, and alignment explicitly typed", () => {
  expectTypeOf<SectionHeaderProps["titleAs"]>().toEqualTypeOf<
    ElementType | undefined
  >();
  expectTypeOf<SectionHeaderProps["titleLevel"]>().toEqualTypeOf<
    HeadingLevel | undefined
  >();
  expectTypeOf<SectionHeaderProps["alignment"]>().toEqualTypeOf<
    SectionHeaderAlignment | undefined
  >();
  expectTypeOf<SectionHeaderAlignment>().toEqualTypeOf<
    "start" | "center" | "end"
  >();
});
