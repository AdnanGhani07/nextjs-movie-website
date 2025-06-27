import Link from "next/link";
import Image from "next/image";

export default function RecommendedMovies({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
        Recommended Movies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recommendations.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-2">
              <div className="relative w-full h-60">
                <Image
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <h3 className="mt-2 text-sm font-medium truncate text-gray-800 dark:text-gray-100">
                {movie.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
