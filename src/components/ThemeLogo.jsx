'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ThemeLogo() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const logoSrc = currentTheme === 'dark' ? '/logo.png' : '/logot.png';

  return (
    <Image
      src={logoSrc}
      alt="logo"
      width={90}
      height={90}
      className="rounded-full shadow-md hover:shadow-gray-400 dark:hover:shadow-gray-800 cursor-pointer"
    />
  );
}
