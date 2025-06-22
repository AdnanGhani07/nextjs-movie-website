import Link from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import NavDropDown from "./NavDropDown";
import ThemeLogo from "./ThemeLogo";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
export default function Header() {
  return (
    <div className="flex justify-between items-center p-3 max-w-6xl mx-auto">
      <div>
        <ThemeLogo />
      </div>
      <ul className="flex gap-5 items-center">
        <li className="pr-2">
          <DarkModeSwitch />
        </li>
        <li className="hidden sm:block hover:text-blue-500">
          <Link href={"/"}>Home</Link>
        </li>
        <li className="hidden sm:block hover:text-blue-500">
          <Link href={"/about"}>About</Link>
        </li>
        <NavDropDown/>
        <SignedIn>
          <UserButton/>
        </SignedIn>
        <SignedOut>
            <Link className="bg-gradient-to-r from-blue-500 via-indigo-600 to-sky-700 text-white px-4 py-2 rounded-lg hover:brightness-110" href={"/sign-in"}>Sign in</Link>
        </SignedOut>
      </ul>
    </div>
  );
}
