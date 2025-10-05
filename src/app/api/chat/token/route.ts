import { env } from "@/env";
import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

// GET lub POST — zależnie jak chcesz wysyłać żądanie z frontu
export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const apiKey = env.STREAM_API_KEY_BACK!;
    const apiSecret = env.STREAM_TOKEN!;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing Stream credentials" },
        { status: 500 },
      );
    }

    // 🔐 Tworzymy instancję StreamChat (tylko po stronie serwera!)
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);

    // 🎟️ Generujemy token dla użytkownika
    const token = serverClient.createToken(id);

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Error creating Stream token:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
