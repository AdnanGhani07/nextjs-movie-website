import Link from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import ThemeLogo from "./ThemeLogo";
export default function Header() {
  return (
    <div className="flex justify-between items-center p-3 max-w-6xl mx-auto">
      <div>
        <ThemeLogo />
      </div>
      <ul className="flex gap-4 items-center">
        <li className="pr-2">
          <DarkModeSwitch />
        </li>
        <li className="hidden sm:block hover:text-blue-500">
          <Link href={"/"}>Home</Link>
        </li>
        <li className="hidden sm:block hover:text-blue-500">
          <Link href={"/about"}>About</Link>
        </li>
        <li className="bg-gradient-to-r from-blue-500 via-indigo-600 to-sky-700 text-white px-4 py-2 rounded-lg hover:brightness-110">
          <Link href={"/sign-in"}>Sign in</Link>
        </li>
      </ul>
    </div>
  );
}
