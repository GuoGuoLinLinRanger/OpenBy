import { analyzeProduct, findKnownProductBySlug } from "@/lib/openby-product";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const profile = findKnownProductBySlug(id);
  if (!profile) notFound();
  const product = analyzeProduct({ productName: profile.productName });

  return <ProductDetailClient product={product} />;
}
