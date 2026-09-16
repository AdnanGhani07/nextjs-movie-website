<div align="center">

# 🎬 CinePulse

**The Minimalist Midnight Entertainment & Cinema Hub**

A high-performance full-stack entertainment aggregator built with **Next.js 15 (App Router)**, **React 19**, **Supabase**, and **Google Gemini AI**. CinePulse delivers an ultra-fast, luxury dark-themed experience for discovering, searching, tracking, and curating movies, TV shows, anime, and manga.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75C2?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Live Demo](https://cinepulse-seven.vercel.app/) • [Report Bug](https://github.com/AdnanGhani07/nextjs-movie-website/issues/new?template=bug_report.md) • [Request Feature](https://github.com/AdnanGhani07/nextjs-movie-website/issues/new?template=feature_request.md)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup (Supabase)](#database-setup-supabase)
  - [Running the Application](#running-the-application)
- [AI Homepage & Cron Automation](#-ai-homepage--cron-automation)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Community & Contributing](#-community--contributing)
- [Security](#-security)
- [License](#-license)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 🌟 Overview

**CinePulse** is designed for cinema purists, binge-watchers, and anime enthusiasts who appreciate lightning-fast navigation and rich editorial details. Instead of locking into a single data provider, CinePulse unites **The Movie Database (TMDB)**, **OMDb**, **TVmaze**, **AniList (GraphQL)**, and **Jikan (MyAnimeList REST)** into a unified interface with resilient fallback chains.

With built-in **Supabase** backend support, users can register, manage profile avatars, bookmark titles to their **Watchlist**, log their **Watched History**, submit **Star Ratings**, and manage **Favorites** under strict PostgreSQL Row-Level Security (RLS).

---

## ✨ Key Features

- **🎬 Multi-Ecosystem Media Aggregation**:
  - **Movies & TV Shows**: Powered by TMDB with metadata enrichment from OMDb and fallback to TVmaze.
  - **Anime & Manga**: Deep catalog exploration with AniList GraphQL and Jikan (MAL) integration, including character rosters and voice actors.
- **🤖 Automated AI Weekly Spotlight**:
  - Uses **Google Gemini 2.5 Flash** via serverless Cron (`/api/cron/generate-homepage`) to analyze trending releases and write engaging editorial summaries with interactive links.
- **🔐 Secure Authentication & User Profiles**:
  - Full-stack session management via `@supabase/ssr`.
  - Custom user profiles with first/last names, email, and avatar uploads backed by Supabase Storage.
- **📌 Personal Media Dashboard**:
  - **Watchlist**: Save movies, anime, and shows to watch later.
  - **Watched History**: Keep track of everything you have completed.
  - **Star Ratings**: Rate individual titles with instant feedback.
  - **Favorites**: Quick access to your top picks.
- **🍿 Rich Interactive Overlays & Modals**:
  - One-click official YouTube trailer modals.
  - Cast member overlays with character pictures and role credits.
  - Dedicated anime character details modal.
- **🔍 Universal Multi-Category Search**:
  - Dynamic live search bar querying across movies, series, anime, and manga.
- **🎨 Midnight Luxury Visuals**:
  - Tailored dark palette (`#08080a`) with warm amber/gold accents.
  - Glassmorphic panels, subtle glow animations, and responsive layouts across all device viewports.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) | App Router, Server Components (RSC), Edge caching, API routes |
| **UI Library** | [React 19](https://react.dev/) | Core UI rendering with React 19 features |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Utility-first styling with custom dark midnight tokens |
| **Database & Auth** | [Supabase](https://supabase.com/) | PostgreSQL, Auth SSR, Storage buckets, Row-Level Security (RLS) |
| **Artificial Intelligence** | [Google Gemini 2.5 Flash](https://aistudio.google.com/) | Automated media synthesis & editorial spotlight generation |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) | Feather Icons (`fi`) and Heroicons 2 (`hi2`) |
| **Data APIs** | TMDB, OMDb, TVmaze, AniList, Jikan | Unified entertainment data pipeline |

---

## 📂 Project Structure

```
nextjs-movie-website/
├── .github/                      # GitHub community standards & issue templates
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md         # Structured bug reporting template
│   │   ├── feature_request.md    # Feature proposal template
│   │   └── config.yml            # Community discussions link
│   ├── CODE_OF_CONDUCT.md        # Contributor Covenant Code of Conduct (v2.1)
│   ├── CONTRIBUTING.md           # Contribution guidelines & Git workflow
│   ├── PULL_REQUEST_TEMPLATE.md  # Standardized PR checklist & template
│   └── SECURITY.md               # Security policy & reporting guidelines
├── public/                       # Static assets & public images
├── src/
│   ├── app/                      # Next.js App Router routes
│   │   ├── [type]/[id]/          # Dynamic route for Anime/Manga detail pages
│   │   ├── about/                # About CinePulse page
│   │   ├── api/
│   │   │   ├── cron/generate-homepage/ # Automated Gemini AI cron job
│   │   │   └── homepagecontent/get/    # Endpoint to retrieve cached spotlight
│   │   ├── auth/callback/        # Supabase OAuth/Auth exchange handler
│   │   ├── movie/[id]/           # Movie detail page with cast & recommendations
│   │   ├── profile/              # User profile, watchlist, history & ratings
│   │   ├── sign-in/              # Authentication sign-in form
│   │   ├── sign-up/              # Authentication registration form
│   │   ├── tv/[id]/              # TV show detail page
│   │   ├── globals.css           # Global CSS variables & glassmorphism utilities
│   │   ├── layout.tsx            # Root layout with Header, Footer, and Fonts
│   │   └── page.tsx              # Homepage (Hero carousel, AI spotlight, Trending rows)
│   ├── components/               # Modular React UI components
│   │   ├── AnimeCard.tsx         # Anime poster card with ratings & badges
│   │   ├── CastOverlay.tsx       # Cast & crew modal
│   │   ├── Header.tsx            # Sticky navbar with navigation & profile dropdown
│   │   ├── Hero.tsx              # Featured hero banner carousel
│   │   ├── RatingWidget.tsx      # Interactive 10-star rating widget
│   │   ├── SearchBar.tsx         # Real-time search dropdown component
│   │   ├── TrailerModal.tsx      # Embedded YouTube video player modal
│   │   ├── WatchlistButton.tsx   # Add/remove watchlist state button
│   │   └── WatchedButton.tsx     # Toggle watched history state button
│   ├── lib/                      # Utilities, API clients, and helpers
│   │   ├── supabase/             # Supabase browser, server, and admin clients
│   │   ├── fetchAnilist.ts       # AniList GraphQL queries
│   │   ├── jikan.ts              # Jikan REST API client with retry logic
│   │   ├── omdb.ts               # OMDb API client for ratings & IMDb links
│   │   ├── tmdb.ts               # TMDB API client with fallback datasets
│   │   ├── tvmaze.ts             # TVmaze API client & conversion adapters
│   │   └── userActions.ts        # Supabase database actions (watchlist, ratings, profile)
│   ├── middleware.ts             # Supabase session refresh middleware
│   └── types/                    # Shared TypeScript interfaces & types
├── .env.local.example            # Environment variables template
├── LICENSE                       # MIT License
├── next.config.mjs               # Next.js configuration (remote image hostnames)
├── package.json                  # Dependencies & build scripts
├── supabase-schema.sql           # Complete PostgreSQL schema, tables, and RLS policies
├── tailwind.config.mjs           # Tailwind CSS theme configuration
├── tsconfig.json                 # TypeScript compiler options
└── vercel.json                   # Vercel Cron job configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.18+` or `v20+` (LTS recommended)
- **Package Manager**: `npm`, `yarn`, or `pnpm`
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AdnanGhani07/nextjs-movie-website.git
   cd nextjs-movie-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory by copying the provided template:

```bash
cp .env.local.example .env.local
```

Configure the following environment variables:

| Variable | Required | Description | Where to get |
| :--- | :---: | :--- | :--- |
| `API_KEY` | **Yes** | TMDB API v3 Key | [The Movie Database](https://www.themoviedb.org/documentation/api) |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Supabase Project URL | [Supabase Dashboard](https://supabase.com) (`Settings > API`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Supabase Public Anon Key | [Supabase Dashboard](https://supabase.com) (`Settings > API`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase Admin Secret Key (for Cron) | [Supabase Dashboard](https://supabase.com) (`Settings > API`) |
| `GEMINI_API_KEY` | Optional | Google Gemini API Key | [Google AI Studio](https://aistudio.google.com/) |
| `CRON_SECRET` | Optional | Bearer token to secure `/api/cron/generate-homepage` | Any random string generated by you |
| `OMDB_API_KEY` | Optional | OMDb API Key for extra IMDb ratings | [OMDb API](http://www.omdbapi.com/apikey.aspx) |
| `TVDB_API_KEY` | Optional | TVDB Key (alternative TV fallback) | [TheTVDB](https://thetvdb.com/) |
| `NEXT_PUBLIC_URL` | Optional | Base URL of your app (default: `http://localhost:3000`) | Local or deployed URL |

### Database Setup (Supabase)

1. Open your project on [Supabase](https://supabase.com).
2. Navigate to the **SQL Editor**.
3. Open [`supabase-schema.sql`](supabase-schema.sql) from this repository, copy its contents, and run the query.
4. This will set up:
   - `profiles`: User profile data synced with Supabase Auth via trigger.
   - `watchlist`: Media saved by users to watch later.
   - `watched_history`: Media logged by users as watched.
   - `ratings`: User star ratings (1–10).
   - `favorites`: User bookmarked favorites.
   - `home_page_content`: Dynamic AI-generated homepage spotlight table.
   - `avatars`: Public storage bucket for profile pictures with RLS upload policies.

### Running the Application

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 AI Homepage & Cron Automation

CinePulse features an automated editorial spotlight powered by **Google Gemini 2.5 Flash**:

1. **Trigger**: Vercel Cron automatically triggers `/api/cron/generate-homepage` daily at midnight (`0 0 * * *`) as defined in [`vercel.json`](vercel.json).
2. **Data Pipeline**:
   - Fetches the top 10 trending movies from TMDB.
   - Sends the titles and metadata to Google Gemini with a prompt to synthesize an engaging weekly spotlight.
   - Validates and stores the formatted JSON output directly in Supabase table `home_page_content`.
3. **Display**: The homepage dynamically displays this spotlight banner, complete with deep links to movie detail pages.

> [!TIP]
> You can manually test the cron endpoint locally by navigating to:
> `http://localhost:3000/api/cron/generate-homepage`

---

## 📜 Available Scripts

In the project root, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Next.js development server with Turbopack |
| `npm run build` | Builds the optimized production application |
| `npm run start` | Starts the production server after building |
| `npm run lint` | Runs ESLint 9 checks to enforce code quality |

---

## 🚢 Deployment

### Deploying on Vercel (Recommended)

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import the repository.
4. Add all environment variables listed in [Environment Variables](#environment-variables) under the **Environment Variables** section in Vercel settings.
5. Click **Deploy**. Vercel will automatically configure routing and schedule the cron job from [`vercel.json`](vercel.json).

---

## 🤝 Community & Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please review our community guidelines before contributing:
- 📜 [Code of Conduct](.github/CODE_OF_CONDUCT.md)
- 🛠️ [Contributing Guide](.github/CONTRIBUTING.md)
- 🐛 [Report a Bug](.github/ISSUE_TEMPLATE/bug_report.md)
- 💡 [Request a Feature](.github/ISSUE_TEMPLATE/feature_request.md)
- 🔒 [Security Policy](.github/SECURITY.md)

---

## 🛡️ Security

If you discover any security-related issues, please refer to our [Security Policy](.github/SECURITY.md) for details on responsible vulnerability disclosure.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 👤 Author & Acknowledgments

- **Adnan Ghani** — [GitHub (@AdnanGhani07)](https://github.com/AdnanGhani07)
- **Data Providers**:
  - [TMDB](https://www.themoviedb.org/) for movie and TV metadata.
  - [AniList](https://anilist.co/) for anime and manga GraphQL APIs.
  - [Jikan API](https://jikan.moe/) for MyAnimeList public REST integration.
  - [TVmaze](https://www.tvmaze.com/api) for TV schedule and show fallback data.
  - [OMDb API](http://www.omdbapi.com/) for additional ratings.
  - [Google Gemini](https://ai.google.dev/) for AI-assisted editorial generation.
