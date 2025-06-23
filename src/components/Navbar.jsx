import NavbarItem from './NavbarItem';

export default function Navbar() {
  return (
    <div className="flex justify-center gap-8 px-4 py-3 lg:text-lg 
      bg-neutral-100 dark:bg-[#121212] 
      border-b border-neutral-300 dark:border-white/10 
      text-gray-800 dark:text-white 
      transition-colors duration-300">
      
      <NavbarItem title="Trending" param="trending" />
      <NavbarItem title="Top Rated" param="rated" />
      <NavbarItem title="New Releases" param="new" />
    </div>
  );
}
