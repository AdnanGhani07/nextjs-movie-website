import Image from "next/image";
import MovieModal from "@/components/MovieModal"; // Reuse the same trailer modal

const API_KEY = process.env.API_KEY;

export default async function TVContentPage({ params }) {
  const { id } = await params;

  const tvRes = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
  );
  const videoRes = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`
  );

  if (!tvRes.ok || !videoRes.ok) {
    throw new Error("Failed to fetch TV show or trailer");
  }

  const tv = await tvRes.json();
  const videos = await videoRes.json();
  const trailer = videos.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">
        {tv.name}
      </h1>

      <div className="flex flex-col md:flex-row gap-6 shadow-lg rounded-lg overflow-hidden border border-indigo-400">
        <div className="relative w-full md:w-1/3 h-[500px]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
            alt={tv.name}
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>

        <div className="flex-1 space-y-4 p-4">
          <p><strong>First Air Date:</strong> {tv.first_air_date}</p>
          <p><strong>Number of Seasons:</strong> {tv.number_of_seasons}</p>
          <p><strong>Number of Episodes:</strong> {tv.number_of_episodes}</p>
          <p><strong>Genres:</strong> {tv.genres?.map(g => g.name).join(", ") || "N/A"}</p>
          <p><strong>Rating:</strong> {tv.vote_average} ({tv.vote_count} votes)</p>
          <p><strong>Status:</strong> {tv.status}</p>
          <p><strong>Language:</strong> {tv.original_language?.toUpperCase()}</p>

          {/* Modal Button */}
          {trailer && (
            <MovieModal trailerKey={trailer.key} title={tv.name} />
          )}
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2 text-indigo-600">Overview</h2>
        <p className="text-gray-800 dark:text-gray-200">{tv.overview}</p>
      </div>
    </div>
  );
}
