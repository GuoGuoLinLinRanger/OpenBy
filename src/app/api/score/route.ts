import { analyzeProduct, type ProductAnalyzeInput } from "@/lib/openby-product";

export async function POST(req: Request) {
  const input = (await req.json()) as ProductAnalyzeInput;

  try {
    return Response.json(analyzeProduct(input));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to score product." },
      { status: 400 }
    );
  }
}
