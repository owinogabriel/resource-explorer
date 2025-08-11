export interface Pokemon {
  id: number;
  name: string;
  url?: string;
  sprites?: PokemonSprites;
  types?: PokemonType[];
  height?: number;
  weight?: number;
  abilities?: PokemonAbility[];
  stats?: PokemonStat[];
  species?: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny?: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
    };
    dream_world: {
      front_default: string | null;
    };
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export type PokemonTypeString = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface SearchFilters {
  query: string;
  type: string;
  favorites: boolean;
}

export interface SortOptions {
  field: 'id' | 'name';
  order: 'asc' | 'desc';
}