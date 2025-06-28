import React from "react";

export default function Footer() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center pb-4 text-center text-sm text-gray-700 dark:text-gray-300">
      <p className="font-semibold hover:text-blue-600 dark:hover:text-pink-600 transition-colors">
        © 2025 CinePulse. All rights reserved.
      </p>
      <p className="font-semibold hover:text-blue-400 dark:hover:text-pink-600 transition-colors">
        Developed by{" "}
        <a href="https://github.com/adnanghani07" target="_blank" className="hover:text-blue-800 dark:hover:text-pink-600 transition-colors">
          Adnan Ghani
        </a>
      </p>
    </div>
  );
}
