/**
 * Call the original function, but applying the debounce rules.
 *
 * Only the last call to the function shall be executed after the timeout has been reached.
 * @returns the debounced function with a cancel function property to clear the timeout.
 */
declare const debounce: <T extends unknown[]>(func: (...args: T) => void, wait: number) => ((...args: T) => void) & {
    cancel: () => void;
};
export { debounce };
