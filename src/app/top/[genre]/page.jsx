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
 

  const res = await fetch(uri, {
    cache: 'no-store',
  });

  console.log(res.status);
  if (!res.ok) throw new Error('Failed to fetch data from TMDB');

  const data = await res.json();
  const results = data.results;

  return (
    <div className='bg-neutral-100 dark:bg-[#121212]'>
      <Results results={results} genre={genre} />
    </div>
  );
}
