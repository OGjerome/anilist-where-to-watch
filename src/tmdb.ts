import { API_KEY, COUNTRIES_CACHE_KEY, TMDB_API_BASE_URL } from "./constants";
import { TmdbCountry, TmdbSearchResponse, TmdbSearchResult, TmdbShowProviders } from "./types";

// Fetch and cache all supported countries
export async function fetchCountries(): Promise<TmdbCountry[]> {
  const cached = localStorage.getItem(COUNTRIES_CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  const response = await fetch(`${TMDB_API_BASE_URL}/configuration/countries?api_key=${API_KEY}`);
  const countries: TmdbCountry[] = await response.json();

  countries.sort((a, b) => a.english_name.localeCompare(b.english_name));
  localStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify(countries));
  return countries;
}

// Search for anime on TMDB (prefers Japanese animation entry)
export async function searchAnime(cleanTitle: string): Promise<TmdbSearchResult | null> {
  const url = `${TMDB_API_BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(cleanTitle)}`;
  const response = await fetch(url);
  const data: TmdbSearchResponse = await response.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  // Genre 16 stands for Animation
  const animeMatch = data.results.find(item => item.genre_ids?.includes(16));
  return animeMatch || data.results[0];
}

// Fetch regional streaming providers for a specific show or movie
export async function fetchWatchProviders(
  id: number,
  mediaType: "movie" | "tv"
): Promise<TmdbShowProviders | null> {
  const url = `${TMDB_API_BASE_URL}/${mediaType}/${id}/watch/providers?api_key=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  return response.json();
}
