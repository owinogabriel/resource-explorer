"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export function Header() {
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 text-2xl">⚡</div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PokéExplorer
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/?favorites=true"
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>Favorites ({favorites.size})</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
