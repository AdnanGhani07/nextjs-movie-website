// app/page.js
import Results from '@/components/Results';

const API_KEY = process.env.API_KEY;

export default async function Home({ searchParams }) {
  const search = await searchParams;
  const page = parseInt(search?.page || '1', 10);

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}&api_key=${API_KEY}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch Top Rated Movies');
  }

  const data = await res.json();
  const results = data.results;
  const totalPages = data.total_pages;

  return (
    <div className="bg-neutral-100 dark:bg-[#121212]">
      <Results
        results={results}
        currentPage={page}
        totalPages={totalPages}
        genre="top_rated"
      />
    </div>
  );
}
