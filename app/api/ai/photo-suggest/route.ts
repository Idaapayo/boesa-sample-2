import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { keyword } = await req.json();

  if (!keyword?.trim()) {
    return Response.json({ error: "keyword is required." }, { status: 400 });
  }

  if (!process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY === "your-unsplash-access-key-here") {
    return Response.json({ error: "UNSPLASH_ACCESS_KEY is not configured." }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword.trim())}&per_page=9&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
    );

    if (!res.ok) {
      return Response.json({ error: "Unsplash API error." }, { status: 502 });
    }

    const { results } = await res.json();
    return Response.json({ photos: results ?? [] });
  } catch {
    return Response.json({ error: "Failed to fetch photos." }, { status: 500 });
  }
}
