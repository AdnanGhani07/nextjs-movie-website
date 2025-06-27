import Image from "next/image";
import SimilarShows from "@/components/SimilarShows";
import CastOverlay from "@/components/CastOverlay";
import dynamic from "next/dynamic";

const API_KEY = process.env.API_KEY;

// Lazy load modal
const TVModal = dynamic(() => import('@/components/MovieModal'));

export default async function TVPage({ params }) {
  const { id } = await params;

  // Fetch TV show details
  const [showRes, videoRes, castRes, similarRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/tv/${id}/aggregate_credits?api_key=${API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`)
  ]);

  if (!showRes.ok || !videoRes.ok || !castRes.ok || !similarRes.ok) {
    throw new Error("Failed to fetch TV show details");
  }

  const show = await showRes.json();
  const videos = await videoRes.json();
  const castData = await castRes.json();
  const similar = await similarRes.json();

  const trailer = videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");
  const cast = castData.cast.slice(0, 12);
  const similarResults = similar.results.slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
        {show.name}
      </h1>

      <div className="flex flex-col md:flex-row gap-6 shadow-lg rounded-lg overflow-hidden border border-blue-400">
        <div className="relative w-full md:w-1/3 h-[500px]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
            alt={show.name}
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>

        <div className="flex-1 space-y-4 p-4">
          <p><strong>First Air Date:</strong> {show.first_air_date}</p>
          <p><strong>Seasons:</strong> {show.number_of_seasons}</p>
          <p><strong>Episodes:</strong> {show.number_of_episodes}</p>
          <p><strong>Genres:</strong> {show.genres?.map(g => g.name).join(", ") || "N/A"}</p>
          <p><strong>Rating:</strong> {show.vote_average} ({show.vote_count} votes)</p>
          <p><strong>Status:</strong> {show.status}</p>
          <p><strong>Language:</strong> {show.original_language?.toUpperCase()}</p>

          {trailer && <TVModal trailerKey={trailer.key} title={show.name} />}
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2 text-blue-600">Overview</h2>
        <p className="text-gray-800 dark:text-gray-200">{show.overview}</p>
      </div>

      {/* Cast Overlay Section */}
      {cast.length > 0 && (
        <div className="mt-10">
          <CastOverlay cast={cast} />
        </div>
      )}

      {/* Similar Shows Section */}
      {similarResults.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3 text-blue-600">Recommended Shows</h2>
          <SimilarShows results={similarResults} />
        </div>
      )}
    </div>
  );
}
