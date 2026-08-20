// app/[type]/[id]/page.tsx
import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { fetchAniListData } from "@/lib/fetchAnilist";
import { JikanAnimeItem, CharacterItem } from "@/types";
import { fetchJikan } from "@/lib/jikan";
import { FiStar, FiTv, FiBookOpen, FiPlay } from "react-icons/fi";
import BackButton from "@/components/BackButton";
import WatchlistButton from "@/components/WatchlistButton";
import WatchedButton from "@/components/WatchedButton";
import RatingWidget from "@/components/RatingWidget";

const TrailerButton = dynamic(() => import("@/components/TrailerButton"));
const CharacterModal = dynamic(() => import("@/components/CharacterModal"));

interface PageProps {
  params: Promise<{ id: string; type: string }>;
}

export default async function ContentPage({ params }: PageProps) {
  const { id, type } = await params;
  const isAnime = type === "anime";

  const baseUrl = isAnime
    ? `https://api.jikan.moe/v4/anime/${id}/full`
    : `https://api.jikan.moe/v4/manga/${id}/full`;

  const characterUrl = `https://api.jikan.moe/v4/${type}/${id}/characters`;

  try {
    // 1. Concurrent Fetch: Jikan Details, Jikan Characters, AniList Details
    const [jikanData, charData, anilistData] = await Promise.all([
      fetchJikan<{ data: JikanAnimeItem }>(baseUrl),
      fetchJikan<{ data: CharacterItem[] }>(characterUrl),
      fetchAniListData(id, isAnime ? "ANIME" : "MANGA"),
    ]);

    // 2. Synthesize with AniList fallback if Jikan rate-limited
    let item: Partial<JikanAnimeItem> | null = jikanData?.data || null;

    if (!item && anilistData) {
      item = {
        mal_id: anilistData.idMal || anilistData.id,
        title: anilistData.title.english || anilistData.title.romaji || "Untitled",
        title_english: anilistData.title.english,
        synopsis: anilistData.description?.replace(/<[^>]*>?/gm, "") || "",
        score: anilistData.averageScore ? anilistData.averageScore / 10 : undefined,
        episodes: anilistData.episodes,
        chapters: anilistData.chapters,
        status: anilistData.status,
        source: anilistData.source,
        genres: anilistData.genres?.map((g, i) => ({
          mal_id: i,
          type: "genre",
          name: g,
          url: "#",
        })),
        images: {
          webp: {
            large_image_url: anilistData.coverImage?.extraLarge || anilistData.coverImage?.large,
            image_url: anilistData.coverImage?.large,
          },
        },
      };
    }

    if (!item) {
      return (
        <div className="text-center py-24 glass-panel rounded-3xl border border-white/5 my-8 space-y-3">
          <p className="text-yellow-400 text-sm font-semibold">
            {type.toUpperCase()} Temporarily Unavailable
          </p>
          <p className="text-zinc-400 text-xs max-w-md mx-auto">
            Both providers are currently busy. Please refresh in a moment.
          </p>
        </div>
      );
    }

    // 3. Characters synthesis (Jikan characters or AniList characters)
    let characters: CharacterItem[] = charData?.data || [];
    if (characters.length === 0 && anilistData?.characters?.edges) {
      characters = anilistData.characters.edges.map((e) => ({
        role: e.role || "Main",
        character: {
          mal_id: e.node?.id || 0,
          name: e.node?.name?.full || "Unknown",
          images: {
            webp: {
              image_url: e.node?.image?.large || e.node?.image?.medium,
            },
          },
        },
      }));
    }

    const title = item.title_english || item.title || "Untitled";
    const imageUrl =
      item.images?.webp?.large_image_url ||
      item.images?.webp?.image_url ||
      item.images?.jpg?.large_image_url ||
      item.images?.jpg?.image_url ||
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80";
    const score = item.score ? item.score.toFixed(1) : null;
    const synopsis = item.synopsis || "No synopsis available.";
    const chapters = item.chapters || item.episodes || "N/A";
    const status = item.status || "N/A";
    const source = item.source || "Unknown";
    const trailer = item.trailer?.url || (anilistData?.trailer?.id ? `https://www.youtube.com/watch?v=${anilistData.trailer.id}` : undefined);

    return (
      <div className="space-y-6">
        <BackButton label={`Back to ${type === "anime" ? "Anime" : "Manga"}`} fallbackHref={`/${type}/top/top`} />

        {/* Header Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 md:p-10">
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative w-56 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 bg-zinc-900">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold uppercase">
                  {type}
                </span>
                {item.genres?.map((g) => (
                  <span
                    key={g.mal_id}
                    className="px-2.5 py-0.5 rounded-full bg-zinc-800/80 border border-white/10 text-[11px] font-medium text-zinc-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {title}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-zinc-300">
                {score && (
                  <span className="flex items-center gap-1 text-yellow-400 font-bold">
                    <FiStar className="fill-yellow-400" /> {score} ({item.scored_by || 0} votes)
                  </span>
                )}
                <span>
                  {isAnime ? <FiTv className="inline mr-1" /> : <FiBookOpen className="inline mr-1" />}
                  {isAnime ? `${chapters} Episodes` : `${chapters} Chapters`}
                </span>
                <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-300">
                  {status}
                </span>
                <span>Source: {source}</span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl pt-2">
                {synopsis}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                {isAnime && trailer && (
                  <Suspense fallback={null}>
                    <TrailerButton trailerUrl={trailer} />
                  </Suspense>
                )}
                {characters.length > 0 && (
                  <Suspense fallback={null}>
                    <CharacterModal characters={characters} />
                  </Suspense>
                )}
                <WatchlistButton
                  mediaId={String(item.mal_id)}
                  mediaType={type}
                  title={title}
                  posterPath={imageUrl}
                />
                <WatchedButton
                  mediaId={String(item.mal_id)}
                  mediaType={type}
                  title={title}
                  posterPath={imageUrl}
                />
                <RatingWidget
                  mediaId={String(item.mal_id)}
                  mediaType={type}
                  title={title}
                  posterPath={imageUrl}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Streaming Episodes */}
        {anilistData?.streamingEpisodes && anilistData.streamingEpisodes.length > 0 && (
          <div className="glass-panel rounded-3xl p-6 border border-white/5">
            <h2 className="text-lg font-bold text-white mb-4">Watch Online</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {anilistData.streamingEpisodes.map((ep, i) => (
                <a
                  key={i}
                  href={ep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-zinc-900/80 rounded-2xl p-3 border border-white/5 hover:border-yellow-500/30 transition shadow"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-zinc-800">
                    <img
                      src={ep.thumbnail}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-lg">
                        <FiPlay className="fill-black text-sm ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-yellow-400 truncate">
                    {ep.title}
                  </h4>
                  <span className="text-[10px] text-zinc-500">{ep.site}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Fetch failed:", error);
    return (
      <div className="text-center py-20 glass-panel rounded-3xl my-8">
        <p className="text-red-400 text-sm">Error loading {type} details.</p>
      </div>
    );
  }
}
