"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/app/components/brand";
import { ProductImage } from "@/app/components/product-image";
import { ChevronDown, ExternalLink, LineChart as LineChartIcon, X } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { productHref, type MetricPoint, type ProductAnalysis, type ProductSignal } from "@/lib/openby-product";

export function ProductDetailClient({ product }: { product: ProductAnalysis }) {
  const [selectedSignal, setSelectedSignal] = useState("trainedPriceModel");
  const active = product.signals.find((signal) => signal.key === selectedSignal) ?? null;

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <BrandMark />
          <Link href="/" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-400">
            New search
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1fr_390px]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-[16/7] bg-slate-100">
            <ProductImage src={product.imageUrl} fallbackSrc={product.fallbackImageUrl} alt={product.productName} query={product.productName} className="h-full w-full object-cover" />
            <div className="absolute left-5 top-5 rounded-md bg-white/92 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              {product.category}
            </div>
            <div className="absolute right-5 top-5">
              <IndexBadge score={product.openByIndex} />
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight">{product.productName}</h1>
                <p className="mt-2 text-slate-500">Updated {product.updatedAt}</p>
              </div>
              <div className="rounded-lg bg-[#f0f9ff] p-4 ring-1 ring-sky-100">
                <p className="text-xs text-sky-700">Verdict</p>
                <p className={`mt-1 text-xl font-semibold ${indexTextClass(product.openByIndex)}`}>{product.verdict}</p>
                <p className="mt-2 max-w-72 text-xs leading-5 text-slate-600">{product.verdictReasons[0]}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>OpenBy Index</span>
                <span>{product.openByIndex}/100</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${indexBarClass(product.openByIndex)}`} style={{ width: `${product.openByIndex}%` }} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
              <MiniMetric label="Current" value={`$${product.currentPrice.toLocaleString()}`} />
              <MiniMetric label="Buy under" value={`$${product.targetBuyPrice.toLocaleString()}`} />
              <MiniMetric label="Predicted" value={`$${product.predictedPrice.toLocaleString()}`} />
              <MiniMetric label="Better window" value={`${product.monteCarloBetterPriceProbability}%`} />
              <MiniMetric label="Confidence" value={`${product.confidence}%`} />
            </div>

            <div className="mt-6 rounded-lg bg-[#fff7ed] p-5 ring-1 ring-orange-100">
              <h2 className="font-semibold">Recommendation</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{product.recommendation}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {product.verdictReasons.slice(1).map((reason) => (
                  <div key={reason} className="rounded-md bg-white/70 p-3 text-sm leading-5 text-slate-700 ring-1 ring-orange-100">
                    {reason}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <LineChartIcon className="h-4 w-4 text-sky-700" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Price path</p>
                  <p className="mt-1 text-sm text-slate-500">Zoomed to this product's recent range so small changes are visible.</p>
                </div>
              </div>
              <PriceLine product={product} />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <SimilarProducts product={product} />
          <NewsPanel product={product} />
        </aside>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <h2 className="text-2xl font-semibold tracking-tight">Inputs behind the score</h2>
          <p className="mt-2 text-sm text-slate-500">Each input has its own view, because price, news, demand, and risk should not all look like the same chart.</p>
          <div className="mt-6 space-y-3">
            {product.signals.map((signal) => {
              const isOpen = active?.key === signal.key;
              return (
                <div key={signal.key} className={`rounded-xl border transition ${isOpen ? "border-slate-950 bg-white shadow-sm" : "border-slate-200 bg-slate-50/70"}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setSelectedSignal(isOpen ? "" : signal.key)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl p-4 text-left transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <div>
                      <p className="font-semibold">{signal.label}</p>
                      <p className="text-xs text-slate-500">
                        {signal.source} - {signal.weight}% of index
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${signalChipClass(signal.value)}`}>{Math.round(signal.value)}</span>
                      <span className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold ${isOpen ? "bg-slate-950 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>
                        {isOpen ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {isOpen ? "Close details" : "View details"}
                      </span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-200 p-4">
                      <p className="text-sm leading-6 text-slate-700">{signal.meaning}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{signal.explanation}</p>
                      <SignalDetail product={product} signal={signal} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function SignalDetail({ product, signal }: { product: ProductAnalysis; signal: ProductSignal }) {
  if (signal.key === "pricePosition") return <PricePosition product={product} signal={signal} />;
  if (signal.key === "newsSentiment") return <NewsLinks product={product} />;
  if (signal.key === "searchTrend") return <TrendLinks product={product} signal={signal} />;
  if (signal.key === "monteCarlo") return <ProbabilityStrip signal={signal} />;
  if (signal.key === "inventory") return <InventorySignal signal={signal} />;
  if (signal.key === "socialDemand") return <DemandTiles signal={signal} />;
  if (signal.key === "volatility") return <StabilityDots signal={signal} />;
  return <SignalSparkline points={signal.history} color={signal.value >= 68 ? "#059669" : signal.value <= 42 ? "#e11d48" : "#d97706"} />;
}

function PriceLine({ product }: { product: ProductAnalysis }) {
  const prices = product.priceHistory.map((point) => point.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const pad = Math.max(8, Math.round((max - min) * 0.18));
  const data = product.priceHistory.map((point) => ({ ...point, target: product.targetBuyPrice }));

  return (
    <div className="h-72 rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 4 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis domain={[min - pad, max + pad]} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(value) => `$${Number(value).toLocaleString()}`} width={72} />
          <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} labelClassName="font-semibold" />
          <ReferenceLine y={product.targetBuyPrice} stroke="#ea580c" strokeDasharray="4 4" label={{ value: "buy under", fill: "#ea580c", fontSize: 12 }} />
          <Area type="monotone" dataKey="price" stroke="#0284c7" strokeWidth={3} fill="url(#priceFill)" dot={{ r: 3, fill: "#0284c7" }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function PricePosition({ product, signal }: { product: ProductAnalysis; signal: ProductSignal }) {
  const prices = product.priceHistory.map((point) => point.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const position = ((product.currentPrice - min) / Math.max(1, max - min)) * 100;

  return (
    <div className="mt-5 rounded-lg bg-[#f0fdf4] p-4 ring-1 ring-emerald-100">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
        <span>${min.toLocaleString()}</span>
        <span>${max.toLocaleString()}</span>
      </div>
      <div className="relative mt-4 h-3 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500">
        <div className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-slate-950 shadow" style={{ left: `${position}%` }} />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-700">
          Current store-check price: <span className="font-semibold">${product.currentPrice.toLocaleString()}</span>
        </p>
        <a href={product.retailerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Popular store links <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-3 text-xs text-slate-500">{signal.goodDirection}</p>
    </div>
  );
}

function SignalSparkline({ points, color }: { points: MetricPoint[]; color: string }) {
  const values = points.map((point) => point.value);
  const min = Math.max(0, Math.floor(Math.min(...values) - 6));
  const max = Math.min(100, Math.ceil(Math.max(...values) + 6));

  return (
    <div className="mt-5 h-52 rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis domain={[min, max]} tick={{ fontSize: 12, fill: "#64748b" }} width={34} />
          <Tooltip formatter={(value) => Math.round(Number(value))} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 3, fill: color }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProbabilityStrip({ signal }: { signal: ProductSignal }) {
  return (
    <div className="mt-5 rounded-lg bg-[#eff6ff] p-4 ring-1 ring-blue-100">
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600">
        <span>Wait likely</span>
        <span>Split</span>
        <span>Buy safer</span>
      </div>
      <div className="relative mt-3 h-12 rounded-md bg-gradient-to-r from-emerald-400 via-amber-300 to-sky-500">
        <div className="absolute top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-full bg-slate-950 shadow" style={{ left: `${signal.value}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-700">{signal.goodDirection}</p>
    </div>
  );
}

function NewsLinks({ product }: { product: ProductAnalysis }) {
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-3">
      {product.news.map((item) => (
        <a key={item.title} href={item.url} target="_blank" rel="noreferrer" className="rounded-lg bg-[#f8fafc] p-4 ring-1 ring-slate-200 hover:ring-sky-200">
          <p className="text-xs font-semibold text-sky-700">{item.outlet}</p>
          <p className="mt-2 text-sm font-semibold leading-5 text-slate-900">{item.title}</p>
          <p className="mt-2 text-xs capitalize text-slate-500">{item.sentiment}</p>
        </a>
      ))}
    </div>
  );
}

function TrendLinks({ product, signal }: { product: ProductAnalysis; signal: ProductSignal }) {
  const links = [
    ["News", `https://news.google.com/search?q=${encodeURIComponent(`${product.productName} demand trend`)}`],
    ["Videos", `https://www.youtube.com/results?search_query=${encodeURIComponent(`${product.productName} review`)}`],
    ["Shopping", product.retailerUrl],
  ];

  return (
    <div className="mt-5 rounded-lg bg-[#fdf2f8] p-4 ring-1 ring-pink-100">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-semibold text-pink-700">{Math.round(signal.value)}</p>
          <p className="text-sm text-slate-600">Demand score</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {links.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-pink-100 hover:ring-pink-300">
              {label} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemandTiles({ signal }: { signal: ProductSignal }) {
  const items = [
    ["Review activity", signal.value + 3],
    ["Forum chatter", signal.value - 5],
    ["Buyer attention", signal.value + 1],
  ];
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg bg-[#f0fdfa] p-4 ring-1 ring-teal-100">
          <p className="text-xs font-semibold text-teal-700">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{Math.round(Number(value))}</p>
        </div>
      ))}
    </div>
  );
}

function StabilityDots({ signal }: { signal: ProductSignal }) {
  return (
    <div className="mt-5 flex gap-2 rounded-lg bg-[#f8fafc] p-4 ring-1 ring-slate-200">
      {Array.from({ length: 10 }).map((_, index) => {
        const filled = index < Math.round(signal.value / 10);
        return <span key={index} className={`h-8 flex-1 rounded-md ${filled ? "bg-indigo-500" : "bg-slate-200"}`} />;
      })}
    </div>
  );
}

function InventorySignal({ signal }: { signal: ProductSignal }) {
  return (
    <div className="mt-5 rounded-lg bg-[#ecfdf5] p-4 ring-1 ring-emerald-100">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>Tight</span>
        <span>Healthy</span>
      </div>
      <div className="mt-3 grid grid-cols-12 gap-1">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} className={`h-9 rounded ${index < Math.round(signal.value / 8.4) ? "bg-emerald-500" : "bg-white ring-1 ring-emerald-100"}`} />
        ))}
      </div>
    </div>
  );
}

function SimilarProducts({ product }: { product: ProductAnalysis }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Similar products</h2>
      <div className="mt-4 space-y-3">
        {product.similarProducts.map((similar) => (
          <a key={similar.productName} href={productHref(similar.productName)} className="flex w-full gap-3 rounded-lg bg-slate-50 p-3 text-left ring-1 ring-slate-200 transition hover:ring-sky-300">
            <ProductImage src={similar.imageUrl} fallbackSrc={similar.fallbackImageUrl} alt={similar.productName} query={similar.productName} className="h-16 w-20 rounded-md object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{similar.productName}</p>
              <p className="text-xs text-slate-500">{similar.category}</p>
              <p className="mt-1 text-sm font-semibold">${similar.currentPrice.toLocaleString()}</p>
            </div>
            <IndexPill score={similar.openByIndex} />
          </a>
        ))}
      </div>
    </div>
  );
}

function NewsPanel({ product }: { product: ProductAnalysis }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Recent news links</h2>
      <p className="mt-1 text-sm text-slate-500">Coverage connected to trend and sentiment inputs.</p>
      <div className="mt-5 space-y-3">
        {product.news.map((item) => (
          <a key={item.title} href={item.url} target="_blank" rel="noreferrer" className="block rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200 transition hover:ring-sky-300">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-slate-500">{item.outlet}</p>
              <span className={`rounded-full px-2 py-1 text-xs capitalize ${sentimentClass(item.sentiment)}`}>{item.sentiment}</span>
            </div>
            <p className="mt-2 text-sm font-medium leading-5 text-slate-900">{item.title}</p>
            <p className="mt-2 text-xs text-slate-500">{item.impact}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function IndexBadge({ score }: { score: number }) {
  return (
    <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-lg text-white shadow-sm ${indexBgClass(score)}`}>
      <div className="text-center">
        <p className="text-2xl font-bold leading-none">{score}</p>
        <p className="text-[10px] text-white/80">INDEX</p>
      </div>
    </div>
  );
}

function IndexPill({ score }: { score: number }) {
  return <span className={`h-fit rounded-full px-2 py-1 text-xs font-semibold ${indexPillClass(score)}`}>{score}</span>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function indexBgClass(score: number) {
  if (score >= 72) return "bg-emerald-600";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-600";
}

function indexBarClass(score: number) {
  if (score >= 72) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-400";
  return "bg-rose-500";
}

function indexTextClass(score: number) {
  if (score >= 72) return "font-semibold text-emerald-700";
  if (score >= 50) return "font-semibold text-amber-700";
  return "font-semibold text-rose-700";
}

function indexPillClass(score: number) {
  if (score >= 72) return "bg-emerald-50 text-emerald-700";
  if (score >= 50) return "bg-amber-50 text-amber-700";
  return "bg-rose-50 text-rose-700";
}

function signalChipClass(score: number) {
  if (score >= 68) return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  if (score <= 42) return "bg-rose-50 text-rose-700 ring-1 ring-rose-100";
  return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
}

function sentimentClass(sentiment: "positive" | "neutral" | "negative") {
  if (sentiment === "positive") return "bg-emerald-50 text-emerald-700";
  if (sentiment === "negative") return "bg-rose-50 text-rose-700";
  return "bg-slate-100 text-slate-600";
}
