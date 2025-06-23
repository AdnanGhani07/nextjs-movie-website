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
        href={`/top/${param}`}
        className={`font-semibold transition-colors duration-200 hover:text-red-500 dark:hover:text-red-400 ${
          isActive
            ? 'underline underline-offset-8 decoration-4 decoration-red-500 dark:decoration-red-400'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {title}
      </Link>
    </div>
  );
}
