# OpenBy
https://project-9j54h-l3lqb1jqn-guoguolinlinrangers-projects.vercel.app/
OpenBy is an electronics price-intelligence platform. A user searches one product, such as `Mac Pro`, and OpenBy returns a clear 0-100 OpenBy Index, buy timing verdict, price target, signal breakdown, verdict explanation, and news/demand context.

The active app is intentionally simple for users: the only input is the product name. It ships with an indexed electronics catalog, statistical price forecasting, Monte Carlo simulation, news/trend links, product image fallbacks, optional Supabase caching, optional Google live search, optional PriceAPI price enrichment, and Vercel Analytics.

## Stack

- Frontend: Next.js, React, TypeScript
- Optional backend: FastAPI, Python
- Data processing: pandas, NumPy
- Model layer: statistical price forecast plus Monte Carlo simulation in the active app
- Storage/cache ready: Supabase-backed `openby_product_reports` cache for active app results
- Optional API layer: Google Programmable Search for dynamic product search/images, PriceAPI for live prices, FastAPI for external scoring

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
- `PRICEAPI_API_KEY`: enables live price enrichment. Without this, the app uses indexed/generative price history.
- `FASTAPI_URL` or `OPENBY_API_URL`: points `/api/analyze` to a deployed FastAPI backend. Without this, the active app uses the built-in Next.js analysis path.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: enables cached product reports in Supabase.

## Supabase Setup

The active app can run without Supabase, but if you want persistent cached reports:

1. Create a Supabase project.
2. Run the migrations in `supabase/migrations`.
3. Add these Vercel environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

The active app reads and writes `openby_product_reports`. Public users can read cached reports; writes use the service role key on the server.

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
- Vercel Analytics and Speed Insights are installed in the app layout.
- Supabase, Google CSE, and PriceAPI integrations are wired as optional production services.

Still needed for a fuller production data product:

- Create real Supabase and API accounts, then add their keys in Vercel.
- Add scheduled jobs if you want prices refreshed in the background instead of only when users request pages.
- Broaden live provider coverage beyond PriceAPI/Google CSE if you want marketplace-grade product matching.
- Deploy the FastAPI backend only if you want Python-side scoring instead of the built-in Next.js scoring.
