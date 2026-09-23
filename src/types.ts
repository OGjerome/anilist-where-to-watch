export interface TmdbProvider {
  provider_id: number;
  provider_name: string;
  logo_path?: string;
}

export interface TmdbCountryData {
  link: string;
  flatrate?: TmdbProvider[];
  ads?: TmdbProvider[];
  free?: TmdbProvider[];
}

export interface TmdbShowProviders {
  id: number;
  results: Record<string, TmdbCountryData>;
}

export interface TmdbCountry {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

export interface TmdbSearchResult {
  id: number;
  media_type: "movie" | "tv";
  genre_ids?: number[];
  origin_country?: string[];
  original_language?: string;
}

export interface TmdbSearchResponse {
  results?: TmdbSearchResult[];
}
