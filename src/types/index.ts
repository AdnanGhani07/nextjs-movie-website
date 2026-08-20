export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_count?: number;
  vote_average?: number;
  media_type?: string;
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  status?: string;
  original_language?: string;
}

export interface JikanImageVariants {
  image_url?: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface JikanImages {
  jpg?: JikanImageVariants;
  webp?: JikanImageVariants;
}

export interface JikanAnimeItem {
  mal_id: number;
  title?: string;
  title_english?: string;
  images?: JikanImages;
  synopsis?: string;
  score?: number;
  scored_by?: number;
  aired?: {
    from?: string;
    to?: string;
    string?: string;
  };
  published?: {
    from?: string;
    to?: string;
    string?: string;
  };
  type?: string;
  episodes?: number;
  chapters?: number;
  status?: string;
  source?: string;
  genres?: Array<{ mal_id: number; type: string; name: string; url: string }>;
  trailer?: {
    youtube_id?: string;
    url?: string;
    embed_url?: string;
  };
}

export interface CharacterItem {
  character: {
    mal_id: number;
    url?: string;
    images: {
      jpg?: JikanImageVariants;
      webp: JikanImageVariants;
    };
    name: string;
  };
  role: string;
}

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
  roles?: Array<{ character: string }>;
}
