"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage a user's favorite Pokémon list.
 * Uses localStorage for persistence and Set<number> for fast lookups.
 */
export function useFavorites() {
  // Store favorite Pokémon IDs in a Set for O(1) add/remove checks
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  /**
   * On mount: Load favorites from localStorage if available.
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pokemon-favorites");
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  }, []);

  /**
   * Toggle a Pokémon ID in favorites:
   * - If it exists, removes it
   * - If it doesn't, adds it
   */
  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);

      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }

      try {
        localStorage.setItem(
          "pokemon-favorites",
          JSON.stringify([...newFavorites])
        );
      } catch (error) {
        console.error("Failed to save favorites:", error);
      }

      return newFavorites;
    });
  }, []);

  /**
   * Add a Pokémon to favorites (no effect if already present).
   */
  const addFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      if (prev.has(id)) return prev; // Skip if already in favorites
      const newFavorites = new Set(prev).add(id);

      try {
        localStorage.setItem(
          "pokemon-favorites",
          JSON.stringify([...newFavorites])
        );
      } catch (error) {
        console.error("Failed to save favorites:", error);
      }

      return newFavorites;
    });
  }, []);

  /**
   * Remove a Pokémon from favorites (no effect if not present).
   */
  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      if (!prev.has(id)) return prev;
      const newFavorites = new Set(prev);
      newFavorites.delete(id);

      try {
        localStorage.setItem(
          "pokemon-favorites",
          JSON.stringify([...newFavorites])
        );
      } catch (error) {
        console.error("Failed to save favorites:", error);
      }

      return newFavorites;
    });
  }, []);

  /**
   * Check if a Pokémon is currently in favorites.
   */
  const isFavorite = useCallback(
    (id: number) => favorites.has(id),
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
