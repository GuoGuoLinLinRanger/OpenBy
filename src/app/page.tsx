"use client";

/* eslint-disable @next/next/no-img-element */
import { FormEvent, useState } from "react";
import { BrandMark } from "@/app/components/brand";
import { ProductImage } from "@/app/components/product-image";
import { productHref, TRENDING_PRODUCTS } from "@/lib/openby-product";

const quickSearches = ["Mac Pro", "AirPods Max", "LG OLED C3", "RTX 4070 Super"];

export default function Home() {
  const [query, setQuery] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = query.trim();
    if (clean) window.location.href = `/search?q=${encodeURIComponent(clean)}`;
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <section className="mx-auto flex min-h-[62vh] max-w-5xl flex-col items-center justify-center px-5 py-16 text-center">
        <div className="mb-8 flex flex-col items-center gap-5">
          <img src="/openby-logo.png" alt="OpenBy logo" className="h-24 w-24 rounded-2xl object-cover shadow-xl shadow-slate-950/15" />
          <BrandMark />
        </div>
        <h1 className="brand-word text-5xl tracking-tight sm:text-7xl">Know when to buy.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Search any electronic product and get a clear buy timing score.
        </p>

        <form onSubmit={onSubmit} className="mt-9 w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-sky-300 focus-within:shadow-md">
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
              placeholder="Search Mac Pro, AirPods, OLED TV..."
              className="min-h-12 flex-1 rounded-lg border-0 bg-transparent px-5 text-lg outline-none placeholder:text-slate-400"
            />
            <button className="min-h-12 rounded-lg bg-slate-950 px-6 font-semibold text-white transition hover:bg-slate-800">
              Search
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {quickSearches.map((item) => (
            <a
              key={item}
              href={productHref(item)}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-slate-950"
            >
              {item}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Recommended right now</h2>
          <p className="mt-1 text-sm text-slate-500">Precomputed OpenBy Index scores for popular electronics.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {TRENDING_PRODUCTS.map((product) => (
            <a
              key={product.id}
              href={productHref(product.productName)}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
            >
              <div className="aspect-[16/8] overflow-hidden bg-slate-100">
                <ProductImage src={product.imageUrl} fallbackSrc={product.fallbackImageUrl} alt={product.productName} query={product.productName} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">{product.category}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-950">{product.productName}</h3>
                  </div>
                  <IndexBadge score={product.openByIndex} />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <MiniMetric label="Now" value={`$${product.currentPrice.toLocaleString()}`} />
                  <MiniMetric label="Target" value={`$${product.targetBuyPrice.toLocaleString()}`} />
                  <MiniMetric label="Verdict" value={product.verdict} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function IndexBadge({ score }: { score: number }) {
  const bg = score >= 72 ? "bg-emerald-600" : score >= 50 ? "bg-amber-500" : "bg-rose-600";
  return (
    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-white shadow-sm ${bg}`}>
      <div className="text-center">
        <p className="text-xl font-bold leading-none">{score}</p>
        <p className="text-[9px] text-white/80">INDEX</p>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
