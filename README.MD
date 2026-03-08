# Movie Platform

Production-grade MERN Movie Discovery Platform scaffold.

## Step 1 Completed

This commit scaffolds the monorepo layout and starter client/server foundations.

- `client`: React (Vite) frontend with Redux Toolkit, Router, services, hooks, and page/component shells.
- `server`: Express backend with MVC folder structure, JWT utility, TMDB service layer, and centralized error middleware.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env files:
   ```bash
   copy server/.env.example server/.env
   copy client/.env.example client/.env
   ```
3. Run both apps:
   ```bash
   npm run dev
   ```

## Project Structure

- `client/`
- `server/`
- `README.md`

The next step is implementing backend server logic and database connection hardening.
