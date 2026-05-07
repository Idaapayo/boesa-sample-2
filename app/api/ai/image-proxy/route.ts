import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return Response.json({ error: "Missing url parameter." }, { status: 400 });
  }

  // Only proxy from known safe domains
  const allowed = ["images.unsplash.com", "plus.unsplash.com"];
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return Response.json({ error: "Invalid URL." }, { status: 400 });
  }
  if (!allowed.some((d) => host === d || host.endsWith("." + d))) {
    return Response.json({ error: "URL not allowed." }, { status: 403 });
  }

  try {
    const upstream = await fetch(url);
    const blob = await upstream.arrayBuffer();
    return new Response(blob, {
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return Response.json({ error: "Failed to fetch image." }, { status: 502 });
  }
}
