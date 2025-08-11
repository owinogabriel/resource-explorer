'use client';

export function PokemonGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-24 h-24 bg-muted rounded-full"></div>
            <div className="space-y-2 text-center w-full">
              <div className="h-5 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
            <div className="flex gap-1">
              <div className="h-6 w-12 bg-muted rounded-full"></div>
              <div className="h-6 w-16 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}