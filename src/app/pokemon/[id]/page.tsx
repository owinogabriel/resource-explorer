import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { pokemonAPI } from "@/lib/api/pokemon";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PokemonDetailPage } from "@/components/Pokemon/PokemonDetailPage";

/**
 * TODO :
 * - Generates dynamic metadata for the Pokémon detail page
 * - Fetches Pokémon data to create SEO-optimized title and description
 */
export async function generateMetadata({
  params,
}: {
  // Promise params is now awaited
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    // Await the params promise to get the route parameters
    const { id } = await params;
    const pokemon = await pokemonAPI.getPokemonById(parseInt(id));

    return {
      title: `${
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
      } - Pokémon Explorer`,
      description: `Learn about ${pokemon.name}, a ${pokemon.types
        ?.map((t) => t.type.name)
        .join("/")} type Pokémon.`,
    };
  } catch {
    // Return fallback metadata if Pokémon not found
    return {
      title: "Pokémon Not Found - Pokémon Explorer",
    };
  }
}

/**
 * Dynamic route page component for individual Pokémon details
 * Handles Pokémon data fetching, validation, and rendering
 */
export default async function PokemonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idString } = await params;
  const id = parseInt(idString);

  // Validate that the ID is a positive number
  if (isNaN(id) || id < 1) {
    notFound();
  }

  try {
    // Fetch Pokémon data from the API
    const pokemon = await pokemonAPI.getPokemonById(id);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Suspense boundary for loading states */}
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <PokemonDetailPage pokemon={pokemon} />
        </Suspense>
      </div>
    );
  } catch {
    // Show 404 page if Pokémon data cannot be fetched
    notFound();
  }
}
