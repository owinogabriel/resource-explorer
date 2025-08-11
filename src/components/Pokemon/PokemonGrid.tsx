'use client';

import { Pokemon } from '@/types/pokemon';
import { PokemonCard } from './PokemonCard';
import { PokemonGridSkeleton } from './PokemonGridSkeleton';

interface PokemonGridProps {
  pokemon: Pokemon[];
  loading: boolean;
}

export function PokemonGrid({ pokemon, loading }: PokemonGridProps) {
  if (loading) {
    return <PokemonGridSkeleton />;
  }

  if (pokemon.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Pokémon Found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {pokemon.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}
