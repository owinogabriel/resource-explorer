"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Shape of  URL state parameters.
 * All properties are optional strings because they
 * are read directly from the URL's query params.
 */
interface UrlState {
  page?: string;
  q?: string;
  filter?: string;
  sort?: string;
  order?: string;
  favorites?: string;
}

/**
 * hook to sync state with the URL's query parameters.
 * Returns the current URL state and an updater function.
 */
export function useUrlState(): [
  UrlState,
  (updates: Partial<UrlState>) => void
] {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<UrlState>({});

  // Sync our local `state` whenever the search params change in the URL
  useEffect(() => {
    const currentState: UrlState = {
      page: searchParams.get("page") || undefined,
      q: searchParams.get("q") || undefined,
      filter: searchParams.get("filter") || undefined,
      sort: searchParams.get("sort") || undefined,
      order: searchParams.get("order") || undefined,
      favorites: searchParams.get("favorites") || undefined,
    };
    setState(currentState);
  }, [searchParams]);

  /**
   * Update the URL's query parameters without reloading the page.
   * Accepts a partial update object. If a key's value is undefined/empty,
   * that key will be removed from the URL.
   */
  const updateUrlState = useCallback(
    (updates: Partial<UrlState>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const newUrl = `${window.location.pathname}${
        params.toString() ? "?" + params.toString() : ""
      }`;

      router.push(newUrl, { scroll: false });
    },
    [router, searchParams]
  );

  return [state, updateUrlState];
}
