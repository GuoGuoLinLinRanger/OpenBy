import { analyzeProduct, type ProductAnalyzeInput } from "@/lib/openby-product";

export async function POST(req: Request) {
  const input = (await req.json()) as ProductAnalyzeInput;
  const backendUrl = process.env.FASTAPI_URL ?? process.env.OPENBY_API_URL;

  if (backendUrl) {
    try {
      const url = backendUrl.endsWith("/analyze")
        ? backendUrl
        : `${backendUrl.replace(/\/$/, "")}/analyze`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (response.ok) return Response.json(await response.json());
    } catch {
      // Keep the UI runnable while external APIs/backends are being wired.
    }
  }

  try {
    return Response.json(analyzeProduct(input));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to analyze product." },
      { status: 400 }
    );
  }
}
