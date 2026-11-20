export type KeyboardEventType = "keydown" | "keyup";
export interface UseKeyboardKeysEvent {
    key: string;
    type: KeyboardEventType;
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    altKey: boolean;
    repeat: boolean;
    nativeEvent: KeyboardEvent;
}
export interface UseKeyboardKeysOptions {
    keys: readonly string[];
    onKeyDown?: (event: UseKeyboardKeysEvent) => void;
    onKeyUp?: (event: UseKeyboardKeysEvent) => void;
    preventDefault?: boolean;
    stopPropagation?: boolean;
    enabled?: boolean;
}
export declare function useKeyboardKeys({ keys, onKeyDown, onKeyUp, preventDefault, stopPropagation, enabled, }: UseKeyboardKeysOptions): void;
