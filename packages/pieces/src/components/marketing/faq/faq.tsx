"use client";

import { Accordion, Heading, TextInput } from "@puzzle-ui/ui";
import { useId, useState, type ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type { FAQItem, FAQSectionProps } from "./faq.types";
import "./faq.css";

const getSearchText = (item: FAQItem) =>
  [
    item.searchText,
    typeof item.question === "string" ? item.question : "",
    item.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();

const FAQSection = <C extends ElementType = "section">({
  variant = "accordion",
  items,
  expandMode = "single",
  searchLabel = "Search questions",
  searchPlaceholder = "Search",
  emptyState,
  children,
  className,
  ...sectionProps
}: FAQSectionProps<C>) => {
  const generatedId = useId();
  const [query, setQuery] = useState("");
  const isSearchable = variant === "searchable";
  const filteredItems = isSearchable
    ? items.filter((item) => getSearchText(item).includes(query.trim().toLocaleLowerCase()))
    : items;
  const categoryGroups =
    variant === "grouped" || variant === "categorized"
      ? [...new Set(filteredItems.map((item) => item.category ?? "General"))]
      : [];

  const renderAccordion = (questions: readonly FAQItem[]) =>
    questions.length ? (
      <Accordion
        className="puzzle-faq__accordion"
        headingLevel={3}
        type={expandMode}
        items={questions.map((item, index) => ({
          id: item.id,
          title:
            variant === "numbered" ? (
              <>
                <span className="puzzle-faq__number">{index + 1}.</span>{" "}
                {item.question}
              </>
            ) : variant === "featured" && item.featured ? (
              <>
                <span className="puzzle-faq__featured-label">Featured</span>{" "}
                {item.question}
              </>
            ) : (
              item.question
            ),
          content: item.answer,
        }))}
      />
    ) : null;

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-faq ${className ?? ""}`.trim()}
      family="faq"
      variant={variant}
    >
      {isSearchable ? (
        <label className="puzzle-faq__search">
          <span>{searchLabel}</span>
          <TextInput
            type="search"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
      ) : null}
      {categoryGroups.length ? (
        <div className="puzzle-faq__groups">
          {variant === "categorized" ? (
            <nav aria-label="Question categories">
              <ul>
                {categoryGroups.map((category, index) => (
                  <li key={category}>
                    <a href={`#${generatedId}-category-${index}`}>{category}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {categoryGroups.map((category, index) => (
            <section
              className="puzzle-faq__group"
              key={category}
              id={variant === "categorized" ? `${generatedId}-category-${index}` : undefined}
              aria-labelledby={`${generatedId}-heading-${index}`}
            >
              <Heading level="headline3" as="h3" id={`${generatedId}-heading-${index}`}>{category}</Heading>
              {renderAccordion(
                filteredItems.filter(
                  (item) => (item.category ?? "General") === category,
                ),
              )}
            </section>
          ))}
        </div>
      ) : (
        renderAccordion(filteredItems)
      )}
      {!filteredItems.length ? (
        <div className="puzzle-faq__empty" role="status">
          {emptyState ??
            (items.length && isSearchable
              ? "No questions match your search."
              : "No questions are available.")}
        </div>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { FAQSection };
