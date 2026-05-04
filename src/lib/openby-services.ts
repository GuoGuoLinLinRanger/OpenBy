import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  analyzeProduct,
  findKnownProductBySlug,
  productSlug,
  searchKnownProducts,
  type ProductAnalysis,
} from "@/lib/openby-product";

type CachedReportRow = {
  slug: string;
  product_name: string;
  category: string | null;
  analysis: ProductAnalysis;
  updated_at: string;
};

type GoogleSearchResponse = {
  items?: Array<{
    title?: string;
    link?: string;
    snippet?: string;
    pagemap?: {
      cse_image?: Array<{ src?: string }>;
      metatags?: Array<{ ["og:image"]?: string; ["product:price:amount"]?: string }>;
    };
  }>;
};

type PriceApiResult = {
  products?: Array<{
    success?: boolean;
    name?: string;
    offers?: Array<{ price?: string; price_with_shipping?: string | null; shop_name?: string }>;
  }>;
};

function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.startsWith("https://") || !key) return null;
  return createClient(url, key);
}

export async function getCachedReportBySlug(slug: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("openby_product_reports")
    .select("slug, product_name, category, analysis, updated_at")
    .eq("slug", slug)
    .maybeSingle<CachedReportRow>();

  if (error || !data?.analysis) return null;
  return { ...data.analysis, dataSource: "database" as const };
}

async function searchCachedReports(query: string) {
  const supabase = getSupabase();
  if (!supabase || query.trim().length < 2) return [];

  const { data, error } = await supabase
    .from("openby_product_reports")
    .select("slug, product_name, category, analysis, updated_at")
    .or(`product_name.ilike.%${query}%,category.ilike.%${query}%`)
    .order("updated_at", { ascending: false })
    .limit(12)
    .returns<CachedReportRow[]>();

  if (error || !data) return [];
  return data.map((row) => ({ ...row.analysis, dataSource: "database" as const }));
}

export async function cacheReport(report: ProductAnalysis) {
  const supabase = getSupabase();
  if (!supabase) return;

  await supabase.from("openby_product_reports").upsert({
    slug: productSlug(report.productName),
    product_name: report.productName,
    category: report.category,
    current_price: report.currentPrice,
    openby_index: report.openByIndex,
    image_url: report.imageUrl,
    analysis: report,
    updated_at: new Date().toISOString(),
  });
}

async function googleProductSearch(query: string) {
  const apiKey = process.env.GOOGLE_CSE_API_KEY;
  const cx = process.env.GOOGLE_CSE_CX;
  if (!apiKey || !cx || query.trim().length < 2) return [];

  const params = new URLSearchParams({
    key: apiKey,
    cx,
    q: `${query} product price review`,
    num: "6",
    safe: "active",
  });

  const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`, {
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!response.ok) return [];

  const data = (await response.json()) as GoogleSearchResponse;
  return (data.items ?? [])
    .map((item) => {
      const productName = cleanProductTitle(item.title ?? query);
      const imageUrl = item.pagemap?.cse_image?.[0]?.src ?? item.pagemap?.metatags?.[0]?.["og:image"];
      const price = parsePrice(item.pagemap?.metatags?.[0]?.["product:price:amount"] ?? item.snippet ?? "");
      return analyzeProduct({
        productName,
        imageUrl,
        retailerUrl: item.link,
        currentPrice: price ?? undefined,
      });
    })
    .filter((report, index, reports) => reports.findIndex((other) => other.id === report.id) === index);
}

function cleanProductTitle(title: string) {
  return title
    .replace(/\s*[|-]\s*(Amazon|Best Buy|Walmart|Apple|Samsung|Sony|Dell|NVIDIA).*$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function parsePrice(text: string) {
  const match = text.match(/\$?\s*([0-9]{2,5}(?:\.[0-9]{2})?)/);
  if (!match) return null;
  const price = Number(match[1]);
  return Number.isFinite(price) && price > 0 ? price : null;
}

async function fetchLivePrice(productName: string) {
  const token = process.env.PRICEAPI_API_KEY ?? process.env.PRICEAPI_TOKEN;
  if (!token) return null;

  const body = new URLSearchParams({
    token,
    source: process.env.PRICEAPI_SOURCE ?? "amazon",
    country: process.env.PRICEAPI_COUNTRY ?? "us",
    key: "term",
    values: productName,
  });

  const create = await fetch("https://api.priceapi.com/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!create.ok) return null;

  const job = (await create.json()) as { job_id?: string };
  if (!job.job_id) return null;

  const timeoutAt = Date.now() + 25000;
  while (Date.now() < timeoutAt) {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const status = await fetch(`https://api.priceapi.com/jobs/${job.job_id}?token=${encodeURIComponent(token)}`);
    const statusData = (await status.json()) as { status?: string };
    if (statusData.status !== "finished") continue;

    const results = await fetch(`https://api.priceapi.com/products/bulk/${job.job_id}?token=${encodeURIComponent(token)}`);
    if (!results.ok) return null;
    const data = (await results.json()) as PriceApiResult;
    const offers = data.products?.find((product) => product.success)?.offers ?? [];
    const prices = offers
      .map((offer) => parsePrice(offer.price ?? offer.price_with_shipping ?? ""))
      .filter((price): price is number => price != null);
    return prices.length > 0 ? Math.min(...prices) : null;
  }

  return null;
}

export async function getProductReportBySlug(slug: string) {
  const cached = await getCachedReportBySlug(slug);
  if (cached) return cached;

  const known = findKnownProductBySlug(slug);
  const productName = known?.productName ?? slug.replace(/-/g, " ");
  const livePrice = await fetchLivePrice(productName);
  const report = analyzeProduct({ productName, currentPrice: livePrice ?? undefined });
  await cacheReport(report);
  return report;
}

export async function searchProducts(query: string) {
  const cached = await searchCachedReports(query);
  if (cached.length > 0) return cached;

  const known = searchKnownProducts(query);
  if (known.length > 0) return known;

  const live = await googleProductSearch(query);
  if (live.length > 0) {
    await Promise.all(live.slice(0, 3).map((report) => cacheReport(report)));
    return live;
  }

  return [analyzeProduct({ productName: query })];
}
