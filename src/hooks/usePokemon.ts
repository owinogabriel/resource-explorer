"use client";

import { useState, useEffect, useCallback } from "react";
import { Pokemon, SearchFilters, SortOptions } from "@/types/pokemon";
import { pokemonAPI } from "@/lib/api/pokemon";

import { useFavorites } from "./useFavorites";
import { useDebounce } from "./useDebounce";

interface UsePokemonProps {
  initialPage?: number;
  pageSize?: number;
  filters?: Partial<SearchFilters>;
  sort?: SortOptions;
}

interface UsePokemonReturn {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPage: (page: number) => void;
  refetch: () => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setSort: (sort: SortOptions) => void;
}

/**
 * Hook for fetching, filtering, and sorting Pokémon data with pagination.
 * Includes favorites integration and debounced search for performance.
 */
export function usePokemon({
  initialPage = 1,
  pageSize = 20,
  filters = {},
  sort = { field: "id", order: "asc" },
}: UsePokemonProps = {}): UsePokemonReturn {
  // State for Pokémon data, loading/error handling, pagination, and filters
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);

  // Merges default filters with provided ones
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: "",
    type: "all",
    favorites: false,
    ...filters,
  });

  const [currentSort, setCurrentSort] = useState(sort);

  // Get favorites set from useFavorites
  const { favorites } = useFavorites();

  // Debounce search queries for performance
  const debouncedQuery = useDebounce(currentFilters.query, 300);

  /**
   * Fetch Pokémon list and details from API
   */
  const fetchPokemon = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);

      try {
        const offset = (currentPage - 1) * pageSize;
        const response = await pokemonAPI.getPokemonList(
          offset,
          pageSize,
          signal
        );

        // Fetch details for each Pokémon in parallel
        const pokemonWithDetails = await Promise.allSettled(
          response.results.map(async (p) => {
            const id = pokemonAPI.extractIdFromUrl(p.url!);
            return await pokemonAPI.getPokemonById(id, signal);
          })
        );

        // Keep only successful responses
        const successfulResults = pokemonWithDetails
          .filter(
            (result): result is PromiseFulfilledResult<Pokemon> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value);

        setPokemon(successfulResults);
        setTotalCount(response.count);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Failed to fetch Pokémon");
        }
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize]
  );

  /**
   * Apply filters (search, type, favorites) and sorting to Pokémon list
   */
  const filteredAndSortedPokemon = useCallback(() => {
    let filtered = [...pokemon];

    // Filter by search query
    if (debouncedQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }

    // Filter by type
    if (currentFilters.type !== "all") {
      filtered = filtered.filter((p) =>
        p.types?.some((t) => t.type.name === currentFilters.type)
      );
    }

    // Filter by favorites
    if (currentFilters.favorites) {
      filtered = filtered.filter((p) => favorites.has(p.id));
    }

    // Sort by selected field
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (currentSort.field) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "id":
        default:
          aValue = a.id;
          bValue = b.id;
          break;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const result = aValue.localeCompare(bValue);
        return currentSort.order === "asc" ? result : -result;
      } else {
        const result = Number(aValue) - Number(bValue);
        return currentSort.order === "asc" ? result : -result;
      }
    });

    return filtered;
  }, [pokemon, debouncedQuery, currentFilters, currentSort, favorites]);

  /**
   * Fetch Pokémon whenever pagination changes
   */
  useEffect(() => {
    const controller = new AbortController();
    fetchPokemon(controller.signal);
    return () => controller.abort();
  }, [fetchPokemon]);

  // Pagination helpers
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    pokemon: filteredAndSortedPokemon(),
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    setPage: setCurrentPage,
    refetch: () => fetchPokemon(),
    setFilters: (newFilters) =>
      setCurrentFilters((prev) => ({ ...prev, ...newFilters })),
    setSort: setCurrentSort,
  };
}
