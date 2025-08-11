'use client';

import { PokemonExplorer } from "@/components/Pokemon/PokemonExplorer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";


export default function HomePage() {
  return(
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold"> Pokémon Explorer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mt-2 mx-auto">
          Discover, Search, and collect your favorite Pokémon with our comprehensive explorer
        </p>
      </div>
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <PokemonExplorer />
      </Suspense>
    </div>
  )
}