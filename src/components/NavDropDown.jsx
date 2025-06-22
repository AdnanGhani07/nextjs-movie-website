'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

export default function NavDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-2xl text-gray-700 dark:text-gray-300 hover:text-blue-500 pt-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-200 dark:bg-gray-800 shadow-lg  rounded-md p-4 z-50">
          <ul className="flex flex-col gap-2 text-gray-800 dark:text-gray-200">
            <li>
              <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
