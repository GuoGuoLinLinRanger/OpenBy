import { TRENDING_PRODUCTS } from "@/lib/openby-product";

export async function GET() {
  return Response.json(TRENDING_PRODUCTS);
}
