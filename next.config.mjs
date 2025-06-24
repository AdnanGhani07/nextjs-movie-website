// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
// next.config.js

/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
    ],
  },
};

export default nextConfig;


