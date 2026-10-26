/**
 * Call the original function, but applying the debounce rules.
 *
 * Only the last call to the function shall be executed after the timeout has been reached.
 * @returns the debounced function with a cancel function property to clear the timeout.
 */
const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  wait: number,
) => {
  let timeout: ReturnType<typeof setTimeout>;

  const cancel = () => clearTimeout(timeout);

  return Object.assign(
    (...args: T) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    },
    { cancel },
  );
};

export { debounce };
