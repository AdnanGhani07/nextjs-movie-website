import NavbarItem from "./NavbarItem";

export default function Navbar() {
  return (
    <div
      className="flex justify-center gap-8 px-4 py-3 lg:text-lg 
      bg-neutral-100 dark:bg-[#121212] 
      border-r-2 border-l-2 border-blue-500 dark:border-blue-400 border-opacity-80 rounded-r-lg rounded-l-lg
      text-gray-800 dark:text-white 
      transition-colors duration-300"
    >
      <NavbarItem title="Trending" param="trending" />
      <NavbarItem title="Upcoming" param="upcoming" />
      <NavbarItem title="TV Shows" param="tv-shows" />
    </div>
  );
}
