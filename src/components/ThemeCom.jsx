'use client';

import { ThemeProvider } from 'next-themes';

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system'>
      <div className='bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen select-none transition-colors duration-300'>
        {children}
      </div>
    </ThemeProvider>
  );
}