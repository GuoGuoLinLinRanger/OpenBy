# OpenBy

OpenBy is an electronics price-intelligence platform. A user searches one product, such as `Mac Pro`, and OpenBy returns a clear 0-100 OpenBy Index, buy timing verdict, price target, signal breakdown, verdict explanation, and news/demand context.

The active app is intentionally simple for users: the only input is the product name. It currently ships with an indexed electronics catalog, statistical price forecasting, Monte Carlo simulation, news/trend links, and product image fallbacks. Optional external APIs can be added for dynamic image search, backend scoring, database storage, and live market data.

## Stack

- Frontend: Next.js, React, TypeScript
- Optional backend: FastAPI, Python
- Data processing: pandas, NumPy
- Model layer: statistical price forecast plus Monte Carlo simulation in the active app
- Storage/cache ready: Supabase code exists in `src/legacy`; the active `src/app` experience is not database-backed yet
- Optional API layer: Google Programmable Search for dynamic product images, FastAPI for external scoring

## Run The Frontend

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The homepage shows a large product search bar and trending recommended electronics with precalculated OpenBy Index scores.

## Environment Variables

Copy `.env.example` when you need external services:

```bash
cp .env.example .env.local
```

For Vercel, add the same values under Project Settings -> Environment Variables.

Optional variables:

- `GOOGLE_CSE_API_KEY` and `GOOGLE_CSE_CX`: enables runtime product image search. Without these, the app uses verified hardcoded images where available and generated placeholders otherwise.
- `FASTAPI_URL` or `OPENBY_API_URL`: points `/api/analyze` to a deployed FastAPI backend. Without this, the active app uses the built-in Next.js analysis path.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: only needed after wiring the active app to Supabase tables.

## Deploy On Vercel

The active Next.js app can deploy without the Python backend or database.

1. Push this repo to GitHub.
2. In Vercel, choose New Project and import the GitHub repo.
3. Keep the detected framework as Next.js.
4. Add optional environment variables if you have them.
5. Deploy.

Useful production checks after deploy:

- `/api/health` should return `{ "status": "ok" }`.
- `/api/trending` should return indexed product reports.
- `/product/macbook-pro-14` should render a product report.

## Optional Backend

Install Python 3.11+ first, then:

```bash
cd backend
pip install -r requirements.txt
cd ..
npm run backend
```

The FastAPI service runs at `http://127.0.0.1:8000`. To use it from the hosted Next.js app, deploy it separately and set `FASTAPI_URL` in Vercel.

Useful endpoints:

- `GET /health`
- `POST /analyze` with `{ "productName": "Mac Pro" }`
- `POST /simulate`

## Scoring Model

OpenBy uses weighted signal aggregation:

- Price forecast: predicts near-term product price from recent trend, smoothing, and volatility
- Monte Carlo safety: simulates thousands of possible 7-day price paths around the forecast
- Price position: compares current price to recent range
- News sentiment: signal from articles and product coverage
- Search trends: demand direction from search interest
- Social virality: forums, reviews, and social attention
- Volatility: risk-adjusted price stability

Each signal is normalized to 0-100, weighted, and combined into the final OpenBy Index.

Score interpretation:

- 72+: Buy now
- 50-71: Watch
- Below 50: Wait

## Repo Notes

The older shopping/deals source from the original archive is preserved in `src/legacy`, but the active app is now the polished electronics OpenBy experience.

## Launch Readiness

Ready now:

- The active Next.js app builds successfully.
- Product pages, search, API routes, brand styling, image fallback, and Monte Carlo scoring work without a database.
- Vercel can host the frontend directly.

Still needed for a full production data product:

- Wire `src/app` to Supabase tables for real product records, price history, cached scores, and analysis history.
- Add real price/news/trend API credentials and replace static indexed prices with live or scheduled data.
- Deploy the FastAPI backend only if you want Python-side scoring instead of the built-in Next.js scoring.
