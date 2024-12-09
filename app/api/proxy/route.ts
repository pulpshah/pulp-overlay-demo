import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch URL: ${url}`);

    let html = await response.text();

    // Inject <base> tag to resolve relative URLs
    html = injectBaseTag(html, url);

    return new Response(html, { headers: { "Content-Type": "text/html" } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Inject a <base> tag to resolve relative URLs
function injectBaseTag(html: string, baseUrl: string): string {
  return html.replace(
    /<head>/i,
    `<head><base href="${baseUrl}">`
  );
}
