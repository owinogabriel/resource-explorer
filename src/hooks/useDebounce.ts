"use client";

import { useState, useEffect } from "react";

/**
 * React hook to delay updating a value until after a given time period.
 * Useful for performance optimizations like debouncing search input.
 *
 * @param value
 * @param delay
 * @returns
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Stores the debounced version of the input value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    //  timeout to update the value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // clear timeout if value or delay changes before the timer completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
