"use client";

import { useState } from "react";
import { usePokemon } from "@/hooks/usePokemon";
import { useUrlState } from "@/hooks/useUrlState";
import { SearchFilters, SortOptions } from "@/types/pokemon";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import { PokemonSearch } from "./PokemonSearch";
import { PokemonFilters } from "./PokemonFilters";
import { PokemonGrid } from "./PokemonGrid";
import { Pagination } from "../common/Pagination";

export function PokemonExplorer() {
  // URL state management (keeps filters/sort/page in sync with query params)
  const [urlState, setUrlState] = useUrlState();

  // Filters for search, type, and favorites
  const [filters, setFilters] = useState<SearchFilters>({
    query: urlState.q || "",
    type: urlState.filter || "all",
    favorites: urlState.favorites === "true",
  });

  // Sorting preferences (by id or name, ascending or descending)
  const [sort, setSort] = useState<SortOptions>({
    field: (urlState.sort as "id" | "name") || "id",
    order: (urlState.order as "asc" | "desc") || "asc",
  });

  // Fetch Pokémon data using custom hook
  const {
    pokemon,
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    setPage,
    refetch,
    setFilters: updateFilters,
    setSort: updateSort,
  } = usePokemon({
    initialPage: parseInt(urlState.page || "1"),
    pageSize: 20,
    filters,
    sort,
  });

  // Handle filter changes and sync to URL
  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateFilters(updatedFilters);

    // Update URL query params, reset to page 1
    setUrlState({
      q: updatedFilters.query || undefined,
      filter: updatedFilters.type !== "all" ? updatedFilters.type : undefined,
      favorites: updatedFilters.favorites ? "true" : undefined,
      page: undefined,
    });

    setPage(1);
  };

  // Handle sort changes and sync to URL
  const handleSortChange = (newSort: SortOptions) => {
    setSort(newSort);
    updateSort(newSort);

    setUrlState({
      sort: newSort.field !== "id" ? newSort.field : undefined,
      order: newSort.order !== "asc" ? newSort.order : undefined,
    });
  };

  // Handle pagination and sync to URL
  const handlePageChange = (page: number) => {
    setPage(page);
    setUrlState({ page: page > 1 ? page.toString() : undefined });
  };

  // Error state with retry button
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={refetch} className="inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and filter controls */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <PokemonSearch
            value={filters.query}
            onChange={(query) => handleFiltersChange({ query })}
          />
        </div>
        <div className="flex-shrink-0">
          <PokemonFilters
            filters={filters}
            sort={sort}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Status text showing current search/filter state */}
      <div className="text-sm text-muted-foreground">
        {loading ? (
          "Loading Pokémon..."
        ) : (
          <>
            Showing {pokemon.length} Pokémon
            {filters.query && ` matching "${filters.query}"`}
            {filters.type !== "all" && ` of type ${filters.type}`}
            {filters.favorites && ` from favorites`}
          </>
        )}
      </div>

      {/* Pokémon results grid */}
      <PokemonGrid pokemon={pokemon} loading={loading} />

      {/* Pagination only when no filters are applied */}
      {!filters.query && !filters.favorites && filters.type === "all" && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={hasNextPage}
          hasPrevious={hasPreviousPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
