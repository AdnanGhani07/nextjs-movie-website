import AnimeNavbarItem from './AnimeNavbarItem';

export default function AnimeNavbar() {
  return (
    <div className="flex justify-center gap-6 px-4 py-3 lg:text-lg 
      bg-neutral-100 dark:bg-[#121212] 
      border-b border-t-2 border-neutral-300 dark:border-white/10 
      text-gray-800 dark:text-white 
      transition-colors duration-300">
      
      <AnimeNavbarItem title="Top Anime" path="/anime/top/top" />
      <AnimeNavbarItem title="Upcoming Anime" path="/anime/top/upcoming" />
      <AnimeNavbarItem title="Popular Anime" path="/anime/top/popular" />
      <AnimeNavbarItem title="Top Manga" path="/manga/top/top" />
      <AnimeNavbarItem title="New Manga" path="/manga/top/new" />
      <AnimeNavbarItem title="Popular Manga" path="/manga/top/popular" />
    </div>
  );
}
