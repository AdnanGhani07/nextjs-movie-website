'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AnimeNavbarItem({ title, path }) {
  const pathname = usePathname();

  const isActive = pathname.startsWith(path);

  return (
    <div>
      <Link
        href={path}
        className={`font-semibold transition-colors duration-200 hover:text-blue-500 dark:hover:text-blue-400 ${
          isActive
            ? 'underline underline-offset-8 decoration-4 decoration-blue-500 dark:decoration-blue-400'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {title}
      </Link>
    </div>
  );
}
