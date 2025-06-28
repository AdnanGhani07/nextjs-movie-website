'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavbarItem({ title, param }) {
  const pathname = usePathname();
  const genre = pathname.split('/')[2];

  const isActive = genre === param;

  return (
    <div>
      <Link
        href={`/movie/top/${param}`}
        className={`font-semibold transition-colors duration-200 hover:text-blue-500 dark:hover:text-pink-400 ${
          isActive
            ? 'underline underline-offset-8 decoration-4 decoration-blue-500 dark:decoration-pink-400'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {title}
      </Link>
    </div>
  );
}
