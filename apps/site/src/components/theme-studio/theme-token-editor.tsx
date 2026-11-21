import { useMemo, useState } from "react";

import { Accordion, Button, TextInput } from "@puzzle-ui/ui";
import { THEME_TOKEN_REGISTRY } from "@puzzle-ui/theme";
import type { ThemeTokenOverrides } from "@puzzle-ui/theme";

import {
  getThemeTokenGroups,
  getThemeTokenPath,
  getThemeTokenValue,
  hasThemeTokenOverrides,
} from "./theme-studio-model";
import { ThemeTokenField } from "./theme-token-field";

const formatGroupName = (group: string): string =>
  group
    .split(".")
    .map((part) =>
      part
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (character) => character.toUpperCase()),
    )
    .join(" / ");

type ThemeTokenEditorProps = {
  tokens: ThemeTokenOverrides;
  onChange: (path: readonly string[], value: string) => void;
  onReset: (path: readonly string[]) => void;
  onResetGroup: (path: readonly string[]) => void;
  onResetAll: () => void;
};

const ThemeTokenEditor = ({
  tokens,
  onChange,
  onReset,
  onResetGroup,
  onResetAll,
}: ThemeTokenEditorProps) => {
  const groups = getThemeTokenGroups();
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<string[]>(() =>
    groups[0] ? [groups[0]] : [],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const visibleGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          group,
          entries: THEME_TOKEN_REGISTRY.filter((entry) => {
            if (entry.group !== group) return false;
            if (!normalizedQuery) return true;

            const searchable = [
              entry.name,
              entry.cssVariable,
              entry.defaultValue,
              getThemeTokenValue(tokens, entry),
              entry.group,
            ]
              .join(" ")
              .toLocaleLowerCase();

            return searchable.includes(normalizedQuery);
          }),
        }))
        .filter(({ entries }) => entries.length > 0),
    [groups, normalizedQuery, tokens],
  );

  const visibleGroupIds = visibleGroups.map(({ group }) => group);
  const openValue = normalizedQuery ? visibleGroupIds : openGroups;
  const accordionItems = visibleGroups.map(({ group, entries }) => ({
    id: group,
    title: (
      <span
        className="theme-studio-token-editor__group-title"
        data-token-group={group}
      >
        <span>{formatGroupName(group)}</span>
        <span className="theme-studio-token-editor__group-meta">
          {hasThemeTokenOverrides(tokens, group) ? "Customized · " : ""}
          {entries.length} {entries.length === 1 ? "token" : "tokens"}
        </span>
      </span>
    ),
    content: (
      <div
        className="theme-studio-token-editor__group-content"
        data-token-group-content={group}
      >
        <div className="theme-studio-token-editor__group-actions">
          <Button
            variant="link"
            size="sm"
            disabled={!hasThemeTokenOverrides(tokens, group)}
            onClick={() => onResetGroup(group.split("."))}
          >
            Reset group
          </Button>
        </div>
        <div className="theme-studio-token-editor__fields">
          {entries.map((entry) => (
            <ThemeTokenField
              key={entry.cssVariable}
              entry={entry}
              value={getThemeTokenValue(tokens, entry)}
              onChange={(value) => onChange(getThemeTokenPath(entry), value)}
              onReset={() => onReset(getThemeTokenPath(entry))}
            />
          ))}
        </div>
      </div>
    ),
  }));

  return (
    <div className="theme-studio-token-editor">
      <div className="theme-studio-token-editor__toolbar">
        <label className="theme-studio-token-editor__search">
          <span>Search tokens</span>
          <TextInput
            type="search"
            value={query}
            placeholder="Name, CSS variable, or value"
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
        <Button
          variant="link"
          size="sm"
          disabled={!hasThemeTokenOverrides(tokens)}
          onClick={onResetAll}
        >
          Reset all design tokens
        </Button>
      </div>
      {visibleGroups.length > 0 ? (
        <Accordion
          className="theme-studio-token-editor__groups"
          items={accordionItems}
          type="multiple"
          headingLevel={3}
          value={openValue}
          onValueChange={(value) => {
            if (!normalizedQuery && Array.isArray(value)) {
              setOpenGroups(value.map(String));
            }
          }}
        />
      ) : (
        <p className="theme-studio-token-editor__empty" role="status">
          No Theme tokens match “{query}”.
        </p>
      )}
    </div>
  );
};

export { ThemeTokenEditor, type ThemeTokenEditorProps };
