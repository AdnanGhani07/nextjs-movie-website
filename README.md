# CInepulse : A Movie Database Website

A movie discovery and details site built with Next.js — designed for browsing, searching and displaying movie metadata.

## Tech Stack
- Next.js (React)
- React
- Tailwind CSS / PostCSS
- Clerk (authentication)
- MongoDB (mongodb driver) + Mongoose (ODM)
- Inngest (background/event handling)
- Google Generative AI SDK (optional integration)
- react-icons
- Svix (webhook client)

## Features
- Browse and search movies
- Movie detail pages with poster, overview and metadata
- Authentication with Clerk (if enabled)
- Background/event processing with Inngest (for jobs or event pipelines)
- Optional integration with Google generative AI and third-party movie APIs

## Quickstart — run locally
1. Clone:
   git clone https://github.com/AdnanGhani07/nextjs-movie-website.git
   
3. Install dependencies:
   cd nextjs-movie-website
   npm install (or yarn / pnpm install)
   
5. Environment
   - Copy example if present:
     cp .env.example .env.local
   - Common env variables you may need:
     - MONGODB_URI=your_mongodb_connection_string
     - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY / CLERK_SECRET_KEY
     - NEXT_PUBLIC_TMDB_API_KEY (if using TMDB)
     - GOOGLE_API_KEY or credentials required by Google SDK
     - SVIX_API_KEY (if webhooks are used)
  
6. Run dev server
   npm run dev
   Open http://localhost:3000
   
7. Build & run production
   npm run build
   npm run start

## Scripts
- dev: next dev
- build: next build
- start: next start
- lint: next lint

## Notes
- Verify which external APIs are used (TMDB, Google, etc.) and set env variables accordingly.
- For server-side API keys, do not prefix with NEXT_PUBLIC.
- Verify which external APIs are used (TMDB, Google, etc.) and set env variables accordingly.
- For server-side API keys, do not prefix with NEXT_PUBLIC.
