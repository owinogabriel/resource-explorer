'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Zap, Save } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import { FavoriteButton } from './FavoriteButton';
import { TypeBadge } from '@/components/common/TypeBadge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface PokemonDetailPageProps {
  pokemon: Pokemon;
}

export function PokemonDetailPage({ pokemon }: PokemonDetailPageProps) {
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');

  // Load saved note on mount
  useState(() => {
    try {
      const savedNote = localStorage.getItem(`pokemon-note-${pokemon.id}`);
      if (savedNote) setNote(savedNote);
    } catch (error) {
      console.error('Failed to load note:', error);
    }
  });

  const handleSaveNote = () => {
    setNoteError('');
    
    if (note.trim().length > 200) {
      setNoteError('Note must be 200 characters or less');
      return;
    }

    try {
      localStorage.setItem(`pokemon-note-${pokemon.id}`, note.trim());
    } catch (error) {
      setNoteError('Failed to save note');
    }
  };

  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default ||
                   pokemon.sprites?.front_default ||
                   '/pokeball.svg';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explorer
          </Button>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold capitalize mb-2">{pokemon.name}</h1>
            <p className="text-xl text-muted-foreground">
              #{pokemon.id.toString().padStart(3, '0')}
            </p>
          </div>
          <FavoriteButton pokemonId={pokemon.id} className="text-2xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Image */}
        <Card>
          <CardContent className="p-8">
            <div className="relative w-full aspect-square max-w-sm mx-auto">
              <Image
                src={imageUrl}
                alt={pokemon.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Physical Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Height</p>
                <p className="text-2xl font-bold">
                  {pokemon.height ? `${(pokemon.height / 10).toFixed(1)} m` : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weight</p>
                <p className="text-2xl font-bold">
                  {pokemon.weight ? `${(pokemon.weight / 10).toFixed(1)} kg` : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {pokemon.types?.map(({ type }) => (
                  <TypeBadge key={type.name} type={type.name} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Abilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities?.map(({ ability, is_hidden }) => (
                  <span
                    key={ability.name}
                    className={`px-3 py-1 rounded-lg text-sm border ${
                      is_hidden 
                        ? 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200'
                        : 'bg-muted'
                    }`}
                  >
                    {ability.name.replace('-', ' ')}
                    {is_hidden && ' (Hidden)'}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats */}
      {pokemon.stats && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Base Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pokemon.stats.map(({ base_stat, stat }) => (
                <div key={stat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize">
                      {stat.name.replace('-', ' ')}
                    </span>
                    <span className="text-sm text-muted-foreground">{base_stat}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min((base_stat / 255) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`Add your personal notes about ${pokemon.name}...`}
                className="w-full p-3 rounded-md border border-input bg-background resize-none h-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {note.length}/200 characters
                </span>
                <Button onClick={handleSaveNote} size="sm" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Note
                </Button>
              </div>
              {noteError && (
                <p className="text-sm text-destructive mt-2">{noteError}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}