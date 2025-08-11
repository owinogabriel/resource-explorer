import { Pokemon, PokemonListResponse } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Singleton service for interacting with the PokeAPI.
 * Includes request caching to minimize redundant network calls.
 */
export class PokemonAPI {
  private static instance: PokemonAPI;
  private cache = new Map<string, any>();

  /**
   * Get the singleton instance of PokemonAPI.
   * Ensures we only have one service instance for caching.
   */
  static getInstance(): PokemonAPI {
    if (!PokemonAPI.instance) {
      PokemonAPI.instance = new PokemonAPI();
    }
    return PokemonAPI.instance;
  }

  /**
   * Fetch data from an endpoint with caching support.
   * @param url - Full API URL to fetch.
   * @param signal - Optional AbortSignal for canceling the request.
   */
  async fetchWithCache<T>(url: string, signal?: AbortSignal): Promise<T> {
    // Return cached response if available
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(url, data);
    return data;
  }

  /**
   * Get a paginated list of Pokémon.
   * @param offset - Number of items to skip.
   * @param limit - Number of items to fetch.
   */
  async getPokemonList(
    offset: number = 0,
    limit: number = 20,
    signal?: AbortSignal
  ): Promise<PokemonListResponse> {
    const url = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
    return this.fetchWithCache<PokemonListResponse>(url, signal);
  }

  /**
   * Fetch Pokémon data by numeric ID.
   */
  async getPokemonById(id: number, signal?: AbortSignal): Promise<Pokemon> {
    const url = `${BASE_URL}/pokemon/${id}`;
    return this.fetchWithCache<Pokemon>(url, signal);
  }

  /**
   * Fetch Pokémon data by name (case-insensitive).
   */
  async getPokemonByName(name: string, signal?: AbortSignal): Promise<Pokemon> {
    const url = `${BASE_URL}/pokemon/${name.toLowerCase()}`;
    return this.fetchWithCache<Pokemon>(url, signal);
  }

  /**
   * Extract numeric Pokémon ID from its API URL.
   */
  extractIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }
}

// Export the singleton instance for easy reuse
export const pokemonAPI = PokemonAPI.getInstance();
