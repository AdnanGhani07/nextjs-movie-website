import Image from "next/image";
import MovieModal from "@/components/MovieModal";
import MovieCastOverlay from "@/components/MovieCastOverlay";
import RecommendedMovies from "@/components/RecommendedMovies";

const API_KEY = process.env.API_KEY;

export default async function MovieContentPage({ params }) {
  const { id } = params;

  const [movieRes, videoRes, creditsRes, recsRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`)
  ]);

  if (!movieRes.ok || !videoRes.ok || !creditsRes.ok || !recsRes.ok)
    throw new Error("Failed to fetch movie details");

  const movie = await movieRes.json();
  const videos = await videoRes.json();
  const credits = await creditsRes.json();
  const recs = await recsRes.json();

  const trailer = videos.results.find((v) => v.type === "Trailer" && v.site === "YouTube");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">{movie.title}</h1>

      <div className="flex flex-col md:flex-row gap-6 shadow-lg rounded-lg overflow-hidden border border-blue-400">
        <div className="relative w-full md:w-1/3 h-[500px]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>

        <div className="flex-1 space-y-4 p-4">
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Runtime:</strong> {movie.runtime} min</p>
          <p><strong>Genres:</strong> {movie.genres?.map((g) => g.name).join(", ") || "N/A"}</p>
          <p><strong>Rating:</strong> {movie.vote_average} ({movie.vote_count} votes)</p>
          <p><strong>Status:</strong> {movie.status}</p>
          <p><strong>Language:</strong> {movie.original_language?.toUpperCase()}</p>

          {trailer && <MovieModal trailerKey={trailer.key} title={movie.title} />}
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2 text-blue-600">Overview</h2>
        <p className="text-gray-800 dark:text-gray-200">{movie.overview}</p>
      </div>

      {/* 👥 Cast Overlay */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Cast</h2>
        <MovieCastOverlay cast={credits.cast} />
      </div>

      {/* 🎞️ Recommendations */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Recommended Movies</h2>
        <RecommendedMovies movies={recs.results.slice(0, 10)} />
      </div>
    </div>
  );
}
