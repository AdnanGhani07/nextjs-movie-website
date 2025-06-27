import Link from "next/link";
import Image from "next/image";

export default function SimilarShows({ results }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {results.map(show => (
        <Link href={`/tv/${show.id}`} key={show.id}>
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
            <Image
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              width={300}
              height={450}
              className="object-cover w-full h-60"
            />
            <div className="p-2">
              <h3 className="text-sm font-semibold truncate">{show.name}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Rating: {show.vote_average}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
