import { NextResponse } from "next/server";

const API_URL = "https://chroma-db-api-369833237955.europe-west1.run.app";
const API_KEY = process.env.CHROMA_API_KEY;

export async function GET(request: Request) {
  const { search, pathname } = new URL(request.url);
  const path = pathname.replace("/api/proxy", "");

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  try {
    console.log(`${API_URL}${path}${search}`);
    const response = await fetch(`${API_URL}${path}${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
