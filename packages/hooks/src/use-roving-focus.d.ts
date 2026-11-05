import { type KeyboardEvent, type RefCallback } from "react";
export type RovingFocusOrientation = "horizontal" | "vertical" | "both";
export type RovingFocusItem = {
    id: string;
    disabled?: boolean;
};
export type UseRovingFocusOptions = {
    items: readonly RovingFocusItem[];
    orientation?: RovingFocusOrientation;
    dir?: "ltr" | "rtl";
    loop?: boolean;
    initialActiveId?: string;
};
export type UseRovingFocusReturn<T extends HTMLElement> = {
    activeId: string | undefined;
    getItemRef: (id: string) => RefCallback<T>;
    getItemTabIndex: (id: string, disabled?: boolean) => 0 | -1;
    focusItem: (id: string) => void;
    onItemFocus: (id: string) => void;
    onItemKeyDown: (event: KeyboardEvent<T>, id: string) => void;
};
declare const useRovingFocus: <T extends HTMLElement>({ items, orientation, dir, loop, initialActiveId, }: UseRovingFocusOptions) => UseRovingFocusReturn<T>;
export { useRovingFocus };
