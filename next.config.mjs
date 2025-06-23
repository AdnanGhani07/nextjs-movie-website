// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;


