"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pokemon } from "@/types/pokemon";
import { FavoriteButton } from "./FavoriteButton";
import { TypeBadge } from "@/components/common/TypeBadge";
import { Card, CardContent } from "@/components/ui/Card";

// Props definition for the PokemonCard
interface PokemonCardProps {
  pokemon: Pokemon; // Full Pokémon data object
}

/**
 * PokemonCard Component
 * ---------------------
 * Displays a styled card for an individual Pokémon.
 * Includes:
 * - Favorite toggle button
 * - Pokémon artwork with error fallback
 * - Name, ID, and type badges
 * - Hover effects and animations
 */
export function PokemonCard({ pokemon }: PokemonCardProps) {
  const [imageError, setImageError] = useState(false);

  // Determine the best available image URL with fallbacks
  const imageUrl =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    "/vercel.svg"; // Final fallback if no image is available

  return (
    <Card className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-4">
        {/* Top-right favorite button */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton pokemonId={pokemon.id} />
        </div>

        {/* Entire card links to the Pokémon detail page */}
        <Link href={`/pokemon/${pokemon.id}`} className="block">
          <div className="flex flex-col items-center space-y-3 text-center">
            {/* Pokémon image with error fallback */}
            <div className="relative w-24 h-24 mx-auto">
              {!imageError ? (
                <Image
                  src={imageUrl}
                  alt={pokemon.name}
                  fill
                  className="object-contain pixelated group-hover:scale-110 transition-transform duration-300"
                  onError={() => setImageError(true)} // Switch to fallback on error
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔮</span>
                </div>
              )}
            </div>

            {/* Pokémon name and formatted ID */}
            <div>
              <h3 className="font-semibold text-lg capitalize text-foreground group-hover:text-primary transition-colors">
                {pokemon.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                #{pokemon.id.toString().padStart(3, "0")}
              </p>
            </div>

            {/* Pokémon type badges */}
            {pokemon.types && pokemon.types.length > 0 && (
              <div className="flex gap-1 flex-wrap justify-center">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type.type.name} type={type.type.name} />
                ))}
              </div>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
