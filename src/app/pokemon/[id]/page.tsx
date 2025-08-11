import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { pokemonAPI } from "@/lib/api/pokemon";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PokemonDetailPage } from "@/components/Pokemon/PokemonDetailPage";

interface PokemonPageProps {
  params: {
    id: string; // Pokémon ID from the dynamic route
  };
}

/**
 * Dynamically generating page metadata for each Pokémon
 *
 */
export async function generateMetadata({
  params,
}: PokemonPageProps): Promise<Metadata> {
  try {
    // Fetch Pokémon data by ID
    const pokemon = await pokemonAPI.getPokemonById(parseInt(params.id));

    return {
      title: `${
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
      } - Pokémon Explorer`,
      description: `Learn about ${pokemon.name}, a ${pokemon.types
        ?.map((t) => t.type.name)
        .join("/")} type Pokémon.`,
    };
  } catch {
    // If fetch fails, set default "Not Found" metadata
    return {
      title: "Pokémon Not Found - Pokémon Explorer",
    };
  }
}

/**
 * Server Component that renders the Pokémon detail page
 */
export default async function PokemonPage({ params }: PokemonPageProps) {
  const id = parseInt(params.id);

  // Handling invalid IDs
  if (isNaN(id) || id < 1) {
    notFound();
  }

  try {
    // Fetch Pokémon data
    const pokemon = await pokemonAPI.getPokemonById(id);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Suspense left in place if child components lazy load sub-parts */}
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <PokemonDetailPage pokemon={pokemon} />
        </Suspense>
      </div>
    );
  } catch {
    // If Pokémon doesn't exist, show Next.js 404 page
    notFound();
  }
}
