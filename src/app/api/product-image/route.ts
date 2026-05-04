type GoogleImageSearchResponse = {
  items?: Array<{
    link?: string;
    image?: { thumbnailLink?: string };
    pagemap?: { cse_image?: Array<{ src?: string }> };
  }>;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const apiKey = process.env.GOOGLE_CSE_API_KEY;
  const cx = process.env.GOOGLE_CSE_CX;

  if (!q || !apiKey || !cx) return Response.json({ imageUrl: null });

  const params = new URLSearchParams({
    key: apiKey,
    cx,
    q: `${q} official product photo`,
    searchType: "image",
    num: "3",
    safe: "active",
    imgType: "photo",
    imgSize: "large",
  });

  try {
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`, {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!response.ok) return Response.json({ imageUrl: null });

    const data = (await response.json()) as GoogleImageSearchResponse;
    const imageUrl = data.items
      ?.map((item) => item.link?.trim() ?? item.pagemap?.cse_image?.[0]?.src?.trim() ?? item.image?.thumbnailLink?.trim())
      .find((url) => url?.startsWith("http"));

    return Response.json({ imageUrl: imageUrl ?? null });
  } catch {
    return Response.json({ imageUrl: null });
  }
}
