import Link from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import NavDropDown from "./NavDropDown";
import ThemeLogo from "./ThemeLogo";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="bg-neutral-100 dark:bg-[#121212] text-black dark:text-white shadow-md border-t-2 border-r-2 border-l-2 border-blue-600 dark:border-pink-500 border-opacity-80 rounded-b-lg rounded-r-lg rounded-l-lg">
      <div className="flex justify-between items-center px-4 py-3 max-w-6xl mx-auto">
        {/* Logo */}
        <div>
          <ThemeLogo />
        </div>

        {/* Nav Items */}
        <ul className="flex gap-5 items-center text-sm sm:text-base">
          <li>
            <DarkModeSwitch />
          </li>

          <li className="hidden sm:block hover:text-blue-600 dark:hover:text-pink-400 transition-colors">
            <Link href="/">Home</Link>
          </li>

          <li className="hidden sm:block hover:text-blue-600 dark:hover:text-pink-400 transition-colors">
            <Link href="/about">About</Link>
          </li>

          <NavDropDown />

          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <Link
              className="bg-gradient-to-r from-blue-500 via-indigo-600 to-sky-700 dark:from-pink-500 dark:via-pink-600 dark:to-pink-700 text-white px-4 py-2 rounded-lg hover:brightness-110 transition"
              href="/sign-in"
            >
              Sign in
            </Link>
          </SignedOut>
        </ul>
      </div>
    </header>
  );
}
