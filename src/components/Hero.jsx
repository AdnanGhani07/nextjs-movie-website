import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-lg">
      {/* Medium height container */}
      <div className="relative w-full h-[500px] bg-white dark:bg-black">
        <Image
          src="/5b6e3ac9-e9e8-4b8e-a17b-30ed9a517bd3.jpeg"
          alt="The Shadow Syndicate Poster"
          fill
          className="object-contain object-center opacity-100 dark:opacity-100"
          priority
        />

        {/* Bottom-left content */}
        <div className="absolute bottom-6 left-5 z-20 max-w-sm backdrop-blur-sm bg-white/20 dark:bg-black/30 p-4 rounded-md">
          <h1 className="text-md sm:text-lg font-bold text-black dark:text-white drop-shadow">
            The Shadow Syndicate
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-900 dark:text-gray-200 drop-shadow-sm">
            A deadly game of cat and mouse unfolds in the shadows of a city where no one can be trusted.
          </p>
          <button className="mt-4 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium shadow-md">
            Watch Trailer
          </button>
        </div>
      </div>
    </section>
  );
}
