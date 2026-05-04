import { getProductReportBySlug } from "@/lib/openby-services";
import { ProductDetailClient } from "./product-detail-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductReportBySlug(id);

  return <ProductDetailClient product={product} />;
}
