"use client";

import { useId, useState, type ElementType, type ReactNode } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type {
  ComparisonFeature,
  ComparisonOption,
  ComparisonSectionProps,
} from "./comparison.types";
import "./comparison.css";

const renderValue = (
  value: boolean | string | number | ReactNode | null | undefined,
) => {
  if (typeof value === "boolean") {
    return (
      <span aria-label={value ? "Included" : "Not included"}>
        {value ? "Yes" : "No"}
      </span>
    );
  }
  return value ?? "Not provided";
};

const ComparisonCards = ({
  options,
  features,
  highlightedOptionId,
}: {
  options: readonly ComparisonOption[];
  features: readonly ComparisonFeature[];
  highlightedOptionId?: string;
}) => (
  <ul className="puzzle-comparison__cards">
    {options.map((option) => (
      <li
        key={option.id}
        data-featured={
          option.featured || option.id === highlightedOptionId || undefined
        }
      >
        <article className="puzzle-comparison__card">
          <h3>{option.title}</h3>
          {option.description ? <p>{option.description}</p> : null}
          <dl>
            {features.map((feature) => (
              <div key={feature.id}>
                <dt>{feature.label}</dt>
                <dd>{renderValue(feature.values[option.id])}</dd>
              </div>
            ))}
          </dl>
          {option.action}
        </article>
      </li>
    ))}
  </ul>
);

const ComparisonSection = <C extends ElementType = "section">(
  props: ComparisonSectionProps<C>,
) => {
  const variant = props.variant ?? "table";
  const generatedId = useId();
  const [uncontrolledId, setUncontrolledId] = useState(
    "defaultSelectedOptionId" in props
      ? props.defaultSelectedOptionId ?? props.options[0]?.id
      : props.options[0]?.id,
  );
  const isInteractive = variant === "interactive";
  const isControlled =
    isInteractive &&
    "selectedOptionId" in props &&
    props.selectedOptionId !== undefined;
  const selectedId = isControlled
    ? props.selectedOptionId
    : uncontrolledId;
  const effectiveSelectedId = props.options.some(
    (option) => option.id === selectedId,
  )
    ? selectedId
    : props.options[0]?.id;
  const isTableLayout = [
    "table",
    "feature-matrix",
    "pricing",
    "highlighted",
    "interactive",
  ].includes(variant);
  const changeSelection = (optionId: string) => {
    if (!isControlled) setUncontrolledId(optionId);
    if ("onSelectionChange" in props) props.onSelectionChange?.(optionId);
  };
  const {
    options: _options,
    features: _features,
    highlightedOptionId: _highlightedOptionId,
    comparisonLabel: _comparisonLabel,
    selectedOptionId: _selectedOptionId,
    defaultSelectedOptionId: _defaultSelectedOptionId,
    onSelectionChange: _onSelectionChange,
    variant: _variant,
    children,
    className,
    ...sectionProps
  } = props;

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-comparison ${className ?? ""}`.trim()}
      family="comparison"
      variant={variant}
    >
      {props.options.length && isTableLayout ? (
        <div
          className="puzzle-comparison__table-scroll"
          tabIndex={0}
          aria-label={props.comparisonLabel ?? "Feature comparison"}
        >
          <table>
            <caption>{props.comparisonLabel ?? "Feature comparison"}</caption>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                {props.options.map((option) => (
                  <th
                    scope="col"
                    key={option.id}
                    data-selected={
                      isInteractive && option.id === effectiveSelectedId
                        ? "true"
                        : undefined
                    }
                    data-featured={
                      option.featured ||
                      option.id === props.highlightedOptionId ||
                      undefined
                    }
                  >
                    {isInteractive ? (
                      <label>
                        <input
                          type="radio"
                          name={`${generatedId}-selection`}
                          value={option.id}
                          checked={option.id === effectiveSelectedId}
                          onChange={() => changeSelection(option.id)}
                        />
                        {option.title}
                      </label>
                    ) : (
                      option.title
                    )}
                    {option.description ? <p>{option.description}</p> : null}
                  </th>
                ))}
              </tr>
            </thead>
            {props.features.length ? (
              <tbody>
                {props.features.map((feature) => (
                  <tr key={feature.id}>
                    <th scope="row">{feature.label}</th>
                    {props.options.map((option) => (
                      <td
                        key={option.id}
                        data-selected={
                          isInteractive && option.id === effectiveSelectedId
                            ? "true"
                            : undefined
                        }
                      >
                        {renderValue(feature.values[option.id])}
                      </td>
                    ))}
                  </tr>
                ))}
                {props.options.some((option) => option.action) ? (
                  <tr>
                    <th scope="row">Action</th>
                    {props.options.map((option) => (
                      <td key={option.id}>{option.action}</td>
                    ))}
                  </tr>
                ) : null}
              </tbody>
            ) : null}
          </table>
        </div>
      ) : props.options.length ? (
        <ComparisonCards
          options={props.options}
          features={props.features}
          highlightedOptionId={props.highlightedOptionId}
        />
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { ComparisonSection };
