# Carbon Footprint Tracker (MERN)

A full-stack MERN application to track and reduce personal carbon emissions with analytics, gamification, and a community forum.

## Tech Stack
- Backend: Node.js, Express, MongoDB, JWT, bcrypt, Joi, Mongoose
- Frontend: React (Vite), Tailwind CSS, React Router, Axios, Recharts

## Project Structure
```
carbon-footprint-tracker/
├─ backend/
│  ├─ models/ (User, EmissionLog, EmissionFactor, Badge, CommunityPost)
│  ├─ routes/ (authRoutes, emissionRoutes, leaderboardRoutes, communityRoutes)
│  ├─ middleware/ (auth, validate)
│  ├─ utils/ (emissionFactors.js, calculator.js)
│  ├─ services/ (recommendationService.js)
│  ├─ scripts/ (seedEmissionFactors.js)
│  ├─ server.js
│  └─ .env.example
└─ frontend/
   ├─ src/
   │  ├─ pages/ (Home, Dashboard, Leaderboard, Community, Profile, LoginSignup)
   │  ├─ components/ (Navbar, DarkModeToggle, EmissionForm, ChartCard, LeaderboardCard, BadgeCard)
   │  ├─ context/ (AuthContext)
   │  └─ api/ (axios instance)
   ├─ index.html
   ├─ tailwind.config.js
   └─ vite.config.js
```
# Run Instructions

## Backend
1. Open a terminal and go to the backend folder:
 ```bash
cd backend
npm install
npm run dev

## Frontend
cd frontend
npm install
npm run dev


## Prerequisites
- Node.js 18+
- MongoDB running locally or a connection string

## Backend Setup
1. Copy env example:
   - Copy `backend/.env.example` to `backend/.env` and fill values:
     - `PORT=5000`
     - `MONGO_URI=mongodb://localhost:27017/carbon_footprint_tracker` (or your Atlas URI)
     - `JWT_SECRET=replace_with_a_long_random_secret`
2. Install deps and run:
   - `npm install` (in `backend`)
   - `npm run dev`
3. Seed emission factors (optional but recommended):
   - `npm run seed:emission-factors`

### Backend API Overview
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Emissions: `POST /api/emissions/log`, `GET /api/emissions/summary?range=daily|weekly|monthly|yearly`, `GET /api/emissions/search-item?q=...`, `GET /api/emissions/recommendations`
- Leaderboard: `GET /api/leaderboard/national`, `GET /api/leaderboard/state/:state`
- Community: `GET /api/community/posts`, `POST /api/community/posts`, `POST /api/community/posts/:id/like`, `POST /api/community/posts/:id/comments`

## Frontend Setup
1. Install deps and run dev server:
   - `npm install` (in `frontend`)
   - `npm run dev`
2. The Vite dev server proxies `/api` to `http://localhost:5000` (configured in `vite.config.js`).

## Environment Variables
- Backend (`backend/.env`):
  - `PORT` (default 5000)
  - `MONGO_URI`
  - `JWT_SECRET`
  - `NODE_ENV` (optional)
  - `OPENAI_API_KEY` (optional stub for future AI integration)
- Frontend: none required for local dev; proxy is already configured.

## Seeding Emission Factors
- Run from `backend`:
  - `npm run seed:emission-factors`

## Deployment Notes
- Frontend (Netlify):
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `dist`
- Backend (Render or Heroku):
  - Use `backend` directory as the root for the service.
  - Run build command: none (Node)
  - Start command: `npm start`
  - Environment variables: `PORT`, `MONGO_URI`, `JWT_SECRET`
  - Configure CORS to allow your frontend domain.



## Notes
- Dark mode is implemented and persisted via `localStorage`.
- UI is responsive (mobile-first). Tables/lists adapt to cards on small screens and charts are responsive.
- An AI recommendation stub exists (`backend/services/recommendationService.js`). Integrate your preferred provider by extending this service.
Shantanu
Raj
.env 