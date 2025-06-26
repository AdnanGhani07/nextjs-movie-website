// app/movie/[id]/page.jsx
import Image from "next/image";
import VideoModal from "@/components/VideoModal"; // import the modal

const API_KEY = process.env.API_KEY;

export default async function MovieContentPage({ params }) {
  const { id } = params;

  const movieRes = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
  );
  const videoRes = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
  );

  if (!movieRes.ok || !videoRes.ok) throw new Error("Failed to fetch movie or trailer");

  const movie = await movieRes.json();
  const videos = await videoRes.json();
  const trailer = videos.results.find((v) => v.type === "Trailer" && v.site === "YouTube");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
        {movie.title}
      </h1>

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
          <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ") || "N/A"}</p>
          <p><strong>Rating:</strong> {movie.vote_average} ({movie.vote_count} votes)</p>
          <p><strong>Status:</strong> {movie.status}</p>
          <p><strong>Language:</strong> {movie.original_language?.toUpperCase()}</p>

          {/* Modal Button */}
          {trailer && (
            <VideoModal trailerKey={trailer.key} title={movie.title} />
          )}
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2 text-blue-600">Overview</h2>
        <p className="text-gray-800 dark:text-gray-200">{movie.overview}</p>
      </div>
    </div>
  );
}
