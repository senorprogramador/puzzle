"use client";

import { DropdownMenu as DropdownMenuRoot } from "./dropdown-menu";
import { DropdownMenuContent } from "./dropdown-menu-content";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./dropdown-menu-items";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./dropdown-menu-radio";
import { DropdownMenuTrigger } from "./dropdown-menu-trigger";

import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuCheckedState,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuItemVariant,
  DropdownMenuLabelProps,
  DropdownMenuPosition,
  DropdownMenuAlignment,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuTriggerProps,
} from "./dropdown-menu.types";

import "./dropdown-menu.css";

type DropdownMenuComponent = typeof DropdownMenuRoot & {
  Trigger: typeof DropdownMenuTrigger;
  Content: typeof DropdownMenuContent;
  Item: typeof DropdownMenuItem;
  Group: typeof DropdownMenuGroup;
  Label: typeof DropdownMenuLabel;
  Separator: typeof DropdownMenuSeparator;
  CheckboxItem: typeof DropdownMenuCheckboxItem;
  RadioGroup: typeof DropdownMenuRadioGroup;
  RadioItem: typeof DropdownMenuRadioItem;
};

const CompoundDropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Group: DropdownMenuGroup,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
}) as DropdownMenuComponent;

export {
  CompoundDropdownMenu as DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
};

export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuPosition,
  DropdownMenuAlignment,
  DropdownMenuItemVariant,
  DropdownMenuCheckedState,
};
