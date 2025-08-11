"use client";

import { Star, SortAsc, SortDesc } from "lucide-react";
import { SearchFilters, SortOptions } from "@/types/pokemon";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { POKEMON_TYPES } from "@/lib/utils/constants";

interface PokemonFiltersProps {
  filters: SearchFilters; // Current active filters (search query, type, favorites)
  sort: SortOptions; // Current sort state (field + order)
  onFiltersChange: (filters: Partial<SearchFilters>) => void; // Callback when filters update
  onSortChange: (sort: SortOptions) => void; // Callback when sort changes
}

export function PokemonFilters({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
}: PokemonFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Pokémon Type Filter */}
      <Select
        value={filters.type}
        onChange={(e) => onFiltersChange({ type: e.target.value })}
      >
        <option value="all">All Types</option>
        {POKEMON_TYPES.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </Select>

      {/* Sort Field Selector */}
      <Select
        value={sort.field}
        onChange={(e) =>
          onSortChange({ ...sort, field: e.target.value as "id" | "name" })
        }
      >
        <option value="id">Sort by ID</option>
        <option value="name">Sort by Name</option>
      </Select>

      {/* Sort Order Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onSortChange({
            ...sort,
            order: sort.order === "asc" ? "desc" : "asc",
          })
        }
        className="px-3"
        aria-label={`Sort ${sort.order === "asc" ? "Descending" : "Ascending"}`}
      >
        {sort.order === "asc" ? (
          <SortAsc className="h-4 w-4" />
        ) : (
          <SortDesc className="h-4 w-4" />
        )}
      </Button>

      {/* Favorites Filter Toggle */}
      <Button
        variant={filters.favorites ? "default" : "outline"}
        size="sm"
        onClick={() => onFiltersChange({ favorites: !filters.favorites })}
        className="px-3"
        aria-label={
          filters.favorites ? "Show All Pokémon" : "Show Only Favorites"
        }
      >
        <Star
          className={`h-4 w-4 ${filters.favorites ? "fill-current" : ""}`}
        />
      </Button>
    </div>
  );
}
