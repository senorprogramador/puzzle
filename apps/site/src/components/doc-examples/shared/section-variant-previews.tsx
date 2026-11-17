import { type ReactNode } from "react";
import { Preview } from "@puzzle-ui/ui";

export type SectionVariantPreview<T extends string> = {
  variant: T;
  useCase: string;
};

type SectionVariantPreviewsProps<T extends string> = {
  componentName: string;
  variants: readonly SectionVariantPreview<T>[];
  buildCode: (variant: T) => string;
  renderVariant: (variant: T) => ReactNode;
};

export const SectionVariantPreviews = <T extends string>({
  componentName,
  variants,
  buildCode,
  renderVariant,
}: SectionVariantPreviewsProps<T>) => (
  <div role="group" aria-label={`${componentName} variants`}>
    {variants.map(({ variant, useCase }) => (
      <article key={variant}>
        <p>
          <strong>{variant}</strong> - {useCase}
        </p>
        <Preview fit="device" code={buildCode(variant)}>
          {renderVariant(variant)}
        </Preview>
      </article>
    ))}
  </div>
);
