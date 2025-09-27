# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Stack: MERN (Node.js, Express, MongoDB, React via Vite), JWT auth, bcrypt, Tailwind (dark mode via class toggle), Recharts for charts.
- Structure: monorepo-style with backend/ (API) and frontend/ (SPA). Backend exposes /api/* endpoints; frontend proxies /api to http://localhost:5000 during dev.

Common commands
Backend (API)
- Install dependencies
  - pwsh: npm install --prefix backend
- Start in dev (nodemon)
  - pwsh: npm run dev --prefix backend
- Start in prod mode
  - pwsh: npm start --prefix backend
- Seed emission factors (populate/upsert base factors)
  - pwsh: npm run seed:emission-factors --prefix backend
- Environment
  - Copy backend/.env.example to backend/.env and set: PORT, MONGO_URI, JWT_SECRET

Frontend (Web)
- Install dependencies
  - pwsh: npm install --prefix frontend
- Run dev server (Vite on http://localhost:5173, proxies /api -> http://localhost:5000)
  - pwsh: npm run dev --prefix frontend
- Build
  - pwsh: npm run build --prefix frontend
- Preview built app
  - pwsh: npm run preview --prefix frontend

Full-stack local development
- Start MongoDB and ensure MONGO_URI in backend/.env is reachable
- Run backend and frontend in separate panes/tabs:
  - pwsh: npm run dev --prefix backend
  - pwsh: npm run dev --prefix frontend
- Quick API smoke test after backend starts:
  - GET http://localhost:5000/ => { status: "ok", service: "Carbon Footprint Tracker API" }

Linting and tests
- No lint or test scripts are currently defined in backend/package.json or frontend/package.json. If you add them (e.g., ESLint, Vitest/Jest), document the commands here and include how to run a single test.

High-level architecture
Backend (Express + Mongoose)
- Entrypoint: backend/server.js
  - Loads env (dotenv), sets CORS and JSON body parsing, uses morgan (except in NODE_ENV=test)
  - Connects to MongoDB via MONGO_URI, then starts HTTP server on PORT (default 5000)
  - Routes mounted under /api/*
- Routes (backend/routes)
  - /api/auth (authRoutes.js)
    - POST /register: Joi-validated name/email/password/state. Uses User.hashPassword (bcrypt). Returns JWT and user.
    - POST /login: Joi-validated. Verifies with user.comparePassword. Returns JWT and user.
    - GET /me: Requires Bearer token; returns user sans passwordHash.
  - /api/emissions (emissionRoutes.js)
    - POST /log: Requires auth. Validates payload via Joi, computes totalCO2 via utils/calculator.computeFromInput, persists EmissionLog.{totalCO2, breakdown}.
    - GET /summary?range=daily|weekly|monthly|yearly: Aggregates the user’s EmissionLog over time window, returns totals and breakdown.
    - GET /search-item?q=...: Finds EmissionFactor by regex name match and suggests alternatives by category.
    - GET /recommendations: Summarizes recent logs and returns guidance from services/recommendationService.
  - /api/leaderboard (leaderboardRoutes.js)
    - GET /national: Aggregates EmissionLog by user over last month; sorts ascending totalCO2 (lower is better).
    - GET /state/:state: Same aggregation but filtered by User.state.
  - /api/community (communityRoutes.js)
    - GET /posts: Latest posts with user populated.
    - POST /posts: Create new post (auth + Joi)
    - POST /posts/:id/like: Toggle like for current user
    - POST /posts/:id/comments: Add a comment (auth + Joi)
- Middleware (backend/middleware)
  - auth.js: Verifies Bearer token (JWT_SECRET) and attaches req.user.id
  - validate.js: Joi schema validator for request bodies
- Data models (backend/models)
  - User: name, email (unique), passwordHash (bcrypt), state, badges[]; methods comparePassword; statics hashPassword
  - EmissionLog: user ref, date, totalCO2, breakdown {vehicleKm, electricityKwh, shoppingSpend, foodKgCO2e, other}
  - EmissionFactor: name, category, unit, factor (kgCO2e per unit)
  - CommunityPost: user, content, likes[], comments[]
  - Badge: name, description, criteria, icon (not yet integrated into flows)
- Utilities and services
  - utils/emissionFactors.js: Baseline factors (e.g., vehicle_km, electricity_kwh, shopping_inr)
  - utils/calculator.js: Builds a factor map and computes totalCO2 from input breakdown
  - services/recommendationService.js: Heuristic recommendations; optional AI provider integration stub
- Scripts
  - scripts/seedEmissionFactors.js: Upserts factors into the database; uses MONGO_URI

Frontend (React + Vite + Tailwind)
- Vite config (frontend/vite.config.js)
  - Dev server on port 5173 with proxy for /api to backend (http://localhost:5000)
- Tailwind config (frontend/tailwind.config.js)
  - darkMode: 'class'; scans ./index.html and ./src/**/*.{js,jsx,ts,tsx}
- API client (frontend/src/api/axios.js)
  - Base URL /api (works with Vite proxy)
  - Request interceptor attaches Authorization: Bearer <token> from localStorage key cft_token
- Auth state (frontend/src/context/AuthContext.jsx)
  - Persists token in localStorage (cft_token); on token change, fetches /auth/me
  - Exposes login, register, logout helpers
- Theming (frontend/src/components/DarkModeToggle.jsx)
  - Persists theme in localStorage (cft_theme) and toggles documentElement.classList('dark')
- Emissions UI (frontend/src/components/EmissionForm.jsx)
  - Collects inputs, posts to /api/emissions/log, resets form, and bubbles result via onLogged
- Pages (frontend/src/pages)
  - Home, Dashboard, Leaderboard, Community, Profile, LoginSignup — routed via React Router (see project pages for details)

Key environment and ports
- Backend API: http://localhost:5000
- Frontend dev: http://localhost:5173 (proxies /api)
- Required env: backend/.env with MONGO_URI and JWT_SECRET; optional OPENAI_API_KEY for future AI integration stub

Notes for Warp
- Prefer running backend and frontend in separate blocks/tabs for clarity.
- When seeding, ensure MongoDB is running and MONGO_URI is set correctly.
- If you add linters/tests, update the commands section so agents can lint and run single tests efficiently.
