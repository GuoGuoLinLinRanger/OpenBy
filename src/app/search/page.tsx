/* eslint-disable @next/next/no-img-element */
import { productHref, TRENDING_PRODUCTS } from "@/lib/openby-product";
import { searchProducts } from "@/lib/openby-services";
import { BrandMark } from "@/app/components/brand";
import { ProductImage } from "@/app/components/product-image";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const results = q.trim() ? await searchProducts(q) : TRENDING_PRODUCTS;
  const fallback = results.length > 0 ? results : TRENDING_PRODUCTS;

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <BrandMark />

        <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Search results</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {results.length > 0 ? `Products related to "${q}"` : `We could not find "${q}" in the indexed database yet.`}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {results.length > 0
              ? "Choose a known product below to open its stored OpenBy report."
              : "OpenBy will not invent a score for products it cannot identify. Try one of these similar indexed products, or search a broader keyword like laptop, monitor, audio, phone, GPU, or OLED."}
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fallback.map((product) => (
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
                    <h2 className="mt-1 text-lg font-semibold text-slate-950">{product.productName}</h2>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${product.openByIndex >= 72 ? "bg-emerald-50 text-emerald-700" : product.openByIndex >= 50 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>
                    {product.openByIndex}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <MiniMetric label="Now" value={`$${product.currentPrice.toLocaleString()}`} />
                  <MiniMetric label="Target" value={`$${product.targetBuyPrice.toLocaleString()}`} />
                  <MiniMetric label="Verdict" value={product.verdict} />
                </div>
              </div>
            </a>
          ))}
        </section>
      </div>
    </main>
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
