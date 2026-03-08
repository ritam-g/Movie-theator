/**
 * useDebounce Custom Hook
 * 
 * This hook delays updating a value until after a specified delay has passed
 * since the last time it was changed. This is useful for:
 * - Search inputs (wait for user to stop typing before searching)
 * - Window resize events
 * - Other expensive operations that shouldn't run on every change
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {any} The debounced value
 */
import { useEffect, useState } from "react";

function useDebounce(value, delay = 500) {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer that will update the debounced value
    // after the specified delay has passed
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: runs before the next effect or on unmount
    // This clears the timer if the value changes before the delay
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  // Return the debounced value
  return debouncedValue;
}

export default useDebounce;
