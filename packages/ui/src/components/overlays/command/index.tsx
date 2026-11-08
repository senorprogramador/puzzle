"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { cn } from "@puzzle-ui/core";

import { Dialog } from "../dialog";

import {
  filterCommands,
  findFirstEnabledIndex,
  findLastEnabledIndex,
  getNextEnabledIndex,
} from "./command.utils";

import type {
  CommandDialogProps,
  CommandItem,
  CommandProps,
} from "./command.types";

import "./command.css";

const Command = ({
  commands,
  placeholder = "Search commands...",
  label = "Search commands",
  emptyMessage = "No commands found.",
  loading = false,
  loadingMessage = "Searching...",
  filter,
  onSelect,
  onQueryChange,
  query,
  defaultQuery = "",
  loop = true,
  autoFocus = true,
  className,
  ...props
}: CommandProps) => {
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const listId = `${baseId}-list`;
  const statusId = `${baseId}-status`;

  const inputRef = useRef<HTMLInputElement>(null);

  const controlledQuery = query !== undefined;

  const [internalQuery, setInternalQuery] = useState(defaultQuery);

  const [activeIndex, setActiveIndex] = useState(-1);

  const currentQuery = controlledQuery ? query : internalQuery;

  const filteredCommands = useMemo(
    () =>
      filter
        ? commands.filter((command) => filter(command, currentQuery))
        : filterCommands(commands, currentQuery),
    [commands, currentQuery, filter],
  );

  const enabledCommands = useMemo(
    () => filteredCommands.filter((command) => !command.disabled),
    [filteredCommands],
  );

  const groupedCommands = useMemo(() => {
    const groups = new Map<string, CommandItem[]>();

    filteredCommands.forEach((command) => {
      const group = command.group ?? "";
      const items = groups.get(group) ?? [];

      items.push(command);
      groups.set(group, items);
    });

    return Array.from(groups.entries());
  }, [filteredCommands]);

  const activeCommand = filteredCommands[activeIndex];

  const changeQuery = useCallback(
    (nextQuery: string) => {
      if (!controlledQuery) {
        setInternalQuery(nextQuery);
      }

      setActiveIndex(-1);
      onQueryChange?.(nextQuery);
    },
    [controlledQuery, onQueryChange],
  );

  const selectCommand = useCallback(
    (command: CommandItem) => {
      if (command.disabled) {
        return;
      }

      command.onSelect?.();
      onSelect?.(command);
    },
    [onSelect],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    changeQuery(event.currentTarget.value);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();

        setActiveIndex((current) =>
          getNextEnabledIndex(filteredCommands, current, 1, loop),
        );

        break;
      }

      case "ArrowUp": {
        event.preventDefault();

        setActiveIndex((current) =>
          getNextEnabledIndex(
            filteredCommands,
            current < 0 ? filteredCommands.length : current,
            -1,
            loop,
          ),
        );

        break;
      }

      case "Home": {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();

          setActiveIndex(findFirstEnabledIndex(filteredCommands));
        }

        break;
      }

      case "End": {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();

          setActiveIndex(findLastEnabledIndex(filteredCommands));
        }

        break;
      }

      case "Enter": {
        event.preventDefault();

        if (activeCommand && !activeCommand.disabled) {
          selectCommand(activeCommand);
        }

        break;
      }
    }
  };

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    inputRef.current?.focus({
      preventScroll: true,
    });
  }, [autoFocus]);

  useEffect(() => {
    if (
      activeIndex >= filteredCommands.length ||
      filteredCommands[activeIndex]?.disabled
    ) {
      setActiveIndex(findFirstEnabledIndex(filteredCommands));
    }
  }, [activeIndex, filteredCommands]);

  return (
    <div {...props} className={cn("puzzle-command", className)} data-command="">
      <div className="puzzle-command__search">
        <svg
          className="puzzle-command__search-icon"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          id={inputId}
          className="puzzle-command__input"
          type="text"
          role="combobox"
          aria-label={label}
          aria-autocomplete="list"
          aria-expanded={true}
          aria-controls={listId}
          aria-activedescendant={
            activeCommand
              ? `${baseId}-item-${encodeURIComponent(activeCommand.id)}`
              : undefined
          }
          aria-describedby={statusId}
          placeholder={placeholder}
          value={currentQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div
        id={listId}
        className="puzzle-command__list"
        role="listbox"
        aria-label="Commands"
        aria-busy={loading}
      >
        {loading ? (
          <div className="puzzle-command__empty" role="status">
            {loadingMessage}
          </div>
        ) : filteredCommands.length === 0 ? (
          <div className="puzzle-command__empty" role="status">
            {emptyMessage}
          </div>
        ) : (
          groupedCommands.map(([group, items]) => {
            const groupId = group
              ? `${baseId}-group-${encodeURIComponent(group)}`
              : undefined;

            return (
              <div
                key={group || "__default"}
                className="puzzle-command__group"
                role="group"
                aria-labelledby={groupId}
              >
                {group && (
                  <div id={groupId} className="puzzle-command__group-heading">
                    {group}
                  </div>
                )}

                {items.map((command) => {
                  const index = filteredCommands.indexOf(command);

                  const selected = index === activeIndex;

                  return (
                    <div
                      key={command.id}
                      id={`${baseId}-item-${encodeURIComponent(command.id)}`}
                      className={cn(
                        "puzzle-command__item",
                        selected && "puzzle-command__item--active",
                        command.disabled && "puzzle-command__item--disabled",
                      )}
                      role="option"
                      aria-selected={selected}
                      aria-disabled={command.disabled || undefined}
                      data-active={selected || undefined}
                      onMouseEnter={() => {
                        if (!command.disabled) {
                          setActiveIndex(index);
                        }
                      }}
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      onClick={() => {
                        selectCommand(command);
                      }}
                    >
                      {command.icon && (
                        <span
                          className="puzzle-command__item-icon"
                          aria-hidden="true"
                        >
                          {command.icon}
                        </span>
                      )}

                      <span className="puzzle-command__item-content">
                        <span className="puzzle-command__item-label">
                          {command.label}
                        </span>

                        {command.description && (
                          <span className="puzzle-command__item-description">
                            {command.description}
                          </span>
                        )}
                      </span>

                      {command.shortcut && (
                        <span className="puzzle-command__shortcut">
                          {command.shortcut}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      <div
        id={statusId}
        className="puzzle-command__sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {loading
          ? loadingMessage
          : enabledCommands.length === 0
            ? emptyMessage
            : `${enabledCommands.length} ${
                enabledCommands.length === 1 ? "command" : "commands"
              } available`}
      </div>
    </div>
  );
};

const CommandDialog = ({
  open,
  defaultOpen = false,
  onOpenChange,
  title = "Command palette",
  description,
  shortcut = "k",
  commands,
  onSelect,
  ...commandProps
}: CommandDialogProps) => {
  const controlled = open !== undefined;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isOpen = controlled ? open : internalOpen;

  const [ownerDocument, setOwnerDocument] = useState<Document | null>(null);

  const rootRef = useCallback((node: HTMLDivElement | null) => {
    setOwnerDocument(node?.ownerDocument ?? null);
  }, []);

  const changeOpen = useCallback(
    (nextOpen: boolean) => {
      if (!controlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [controlled, onOpenChange],
  );

  useEffect(() => {
    if (shortcut === false || !ownerDocument) {
      return;
    }

    const view = ownerDocument.defaultView;

    if (!view) {
      return;
    }

    const handleGlobalKeyDown: EventListener = (event) => {
      if (!(event instanceof view.KeyboardEvent)) {
        return;
      }

      const keyboardEvent = event;

      if (
        keyboardEvent.defaultPrevented ||
        keyboardEvent.isComposing ||
        keyboardEvent.key.toLowerCase() !== shortcut.toLowerCase() ||
        !(keyboardEvent.metaKey || keyboardEvent.ctrlKey) ||
        keyboardEvent.shiftKey ||
        keyboardEvent.altKey
      ) {
        return;
      }

      const target = keyboardEvent.target;

      if (target instanceof view.HTMLElement) {
        const isEditable =
          target.isContentEditable ||
          target.closest(
            [
              "input",
              "textarea",
              "select",
              '[contenteditable="true"]',
              '[role="textbox"]',
            ].join(", "),
          ) !== null;

        if (isEditable) {
          return;
        }
      }

      keyboardEvent.preventDefault();
      changeOpen(!isOpen);
    };

    ownerDocument.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      ownerDocument.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [ownerDocument, shortcut, isOpen, changeOpen]);

  return (
    <div ref={rootRef} data-command-dialog-root="">
      <Dialog
        open={isOpen}
        onOpenChange={changeOpen}
        title={title}
        description={description}
        size="md"
        closeButton={false}
        className="puzzle-command-dialog"
      >
        <Command
          {...commandProps}
          commands={commands}
          autoFocus={isOpen}
          onSelect={(command) => {
            onSelect?.(command);
            changeOpen(false);
          }}
        />
      </Dialog>
    </div>
  );
};

export {
  Command,
  CommandDialog,
  type CommandItem,
  type CommandProps,
  type CommandDialogProps,
};
