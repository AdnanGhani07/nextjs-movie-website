// app/top/[genre]/page.jsx
import Results from '@/components/Results';

const API_KEY = process.env.API_KEY;

export default async function Home({ params }) {
  const p = await params;
  const genre = p?.genre || 'trending';

  let uri = '';

  if (genre === 'tv-shows') {
    uri = `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&page=1&language=en-US`;
  } 
  if (genre === 'upcoming') {
    uri = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&page=1&language=en-US`;
  } 
  if (genre === 'trending') {
    uri = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1&language=en-US`;
  }
 

  try {
    const res = await fetch(uri, { cache: 'no-store' });
  
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
  
    const data = await res.json();
    // continue using `data`
  
  } catch (error) {
    console.error("Fetch failed:", error);
    return <div className="text-red-500 text-center mt-10">Error loading data. Please try again later.</div>;
  }
  
  const results = data.results;

  return (
    <div className='bg-neutral-100 dark:bg-[#121212]'>
      <Results results={results} genre={genre} />
    </div>
  );
}
