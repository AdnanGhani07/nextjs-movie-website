# Contributing to CinePulse

First off, thank you for considering contributing to **CinePulse**! 🎉

Whether you're fixing a bug, adding a new entertainment API fallback, refining the dark midnight luxury UI, or optimizing server components, your help is warmly welcomed.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Features & Enhancements](#suggesting-features--enhancements)
   - [Pull Requests](#pull-requests)
3. [Local Development Setup](#local-development-setup)
4. [Git Workflow & Commit Guidelines](#git-workflow--commit-guidelines)
5. [Coding Standards](#coding-standards)
6. [Recognition](#recognition)

---

## Code of Conduct

This project and everyone participating in it is governed by the [CinePulse Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior via GitHub issues or project maintainers.

---

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check existing issues to ensure the bug has not already been reported.

When creating an issue, please use the **Bug Report Template** and provide as much context as possible:
- A clear, descriptive title.
- Steps to reproduce the problem.
- Expected behavior vs. actual behavior.
- Screenshots or screen recordings if UI-related.
- Browser name, version, and operating system.
- Any relevant console errors or terminal stack traces.

### Suggesting Features & Enhancements

We welcome new ideas! If you want to propose a new feature:
- Check existing issues or discussions to see if it's already planned or discussed.
- Use the **Feature Request Template**.
- Explain the problem the feature solves and provide clear rationale/mockups if possible.

### Pull Requests

To contribute code:

1. **Fork** the repository and create your branch from `main`.
2. Follow the [Local Development Setup](#local-development-setup).
3. Ensure your code passes linting (`npm run lint`) and TypeScript checks (`npx tsc --noEmit`).
4. Write clean, self-documenting code with meaningful commit messages.
5. Submit a **Pull Request** referencing any related issues.

---

## Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ recommended
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Git**

### 2. Fork & Clone
```bash
git clone https://github.com/your-username/nextjs-movie-website.git
cd nextjs-movie-website
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in the required API keys:
- `TMDB_API_KEY`: Your TMDB API v3 key (free from [The Movie Database](https://www.themoviedb.org/documentation/api))
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: From your [Supabase](https://supabase.com) project
- `SUPABASE_SERVICE_ROLE_KEY`: Service role secret for admin cron operations
- `GEMINI_API_KEY`: Google Gemini AI API key from [Google AI Studio](https://aistudio.google.com/)
- `CRON_SECRET`: Random secret string for securing `/api/cron/generate-homepage`

### 5. Setup Supabase Database
Run the SQL script found in `supabase-schema.sql` inside the Supabase SQL Editor to provision:
- `profiles`, `favorites`, `watchlist`, `watched_history`, `ratings`, `home_page_content` tables
- Storage bucket `avatars` with public read and authenticated write policies
- User trigger for profile creation on sign-up

### 6. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Git Workflow & Commit Guidelines

### Branch Naming
Please use descriptive branch names:
- `feat/feature-name` (e.g., `feat/trailers-player`)
- `fix/bug-description` (e.g., `fix/auth-redirect`)
- `docs/documentation-changes` (e.g., `docs/update-readme`)
- `refactor/component-name` (e.g., `refactor/header-search`)

### Commit Messages (Conventional Commits)
We recommend following the [Conventional Commits](https://www.conventionalcommits.org/) convention:
```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```
Examples:
- `feat(auth): add google oauth provider support`
- `fix(anime): handle rate limit from jikan api gracefully`
- `docs(readme): add installation guide and architecture diagram`
- `style(ui): improve contrast on movie card rating badge`

---

## Coding Standards

- **TypeScript**: Strict typing without unnecessary `any`. Keep types organized in `src/types/`.
- **Styling**: Use Tailwind CSS utility classes adhering to the midnight dark theme palette (`#08080a`, yellow accents `yellow-400`/`amber-400`).
- **Next.js Best Practices**:
  - Prefer React Server Components (RSC) for data fetching.
  - Use `"use client"` only when interactivity, state, or browser APIs are required.
  - Optimize images using `next/image` with proper `sizes` and domains configured in `next.config.mjs`.
- **Linting**:
  ```bash
  npm run lint
  ```

---

## Pull Request Checklist

Before submitting:
- [ ] My code follows the code style and conventions of the project.
- [ ] I have verified the changes locally using `npm run dev`.
- [ ] I have run `npm run lint` and resolved all warnings and errors.
- [ ] I have updated the documentation or README if relevant.
- [ ] My branch is rebased on the latest `main` branch.

Thank you for building CinePulse with us! 🍿
