"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/Button";

// Props definition for the FavoriteButton component
interface FavoriteButtonProps {
  pokemonId: number;
  className?: string;
}

/**
 * FavoriteButton Component
 * ------------------------
 * A clickable heart icon button that toggles a Pokémon
 * as a favorite in local storage via the useFavorites hook.
 */
export function FavoriteButton({ pokemonId, className }: FavoriteButtonProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.has(pokemonId);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(pokemonId); // Add/remove from favorites
      }}
      className={`p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all duration-200 ${
        isFavorite ? "text-red-500" : "text-muted-foreground"
      } ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {/* Heart icon, filled if favorite */}
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
    </Button>
  );
}
