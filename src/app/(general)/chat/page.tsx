"use client";

import { useState, useEffect, use } from "react";
import type { User, Channel as StreamChannel } from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { useSession } from "next-auth/react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY_FRONT!;

export default function ChatApp() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchToken(session.user.id);
    }
  }, [session?.user?.id]);

  const fetchToken = async (userId: string) => {
    const res = await fetch("/api/chat/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId }),
    });

    const data = await res.json();
    setToken(data.token);
  };

  // prepare user if logged in
  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || "Nieznany użytkownik",
        image: session.user.image || undefined,
      }
    : null;

  // 🔑 Now render logic is separated
  if (status === "loading") {
    return <div>Ładowanie sesji...</div>;
  }

  if (!user) {
    return <div>Musisz być zalogowany, aby korzystać z czatu.</div>;
  }

  if (!token) {
    return <div>Ładowanie czatu...</div>;
  }

  return <ChatProvider user={user} token={token} />;
}

function ChatProvider({ user, token }: { user: User; token: string | null }) {
  const [channel, setChannel] = useState<StreamChannel>();

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: user,
  });

  useEffect(() => {
    if (!client) return;

    const channel = client.channel("messaging", "custom_channel_id", {
      image:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fkrakow.pl%2Fnasze_miasto%2F15182%2Cartykul%2Curzad.html&psig=AOvVaw1mwq-ZdjykLkHyT5o2c8_t&ust=1759723853552000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKC6r6uYjJADFQAAAAAdAAAAABAL",
      name: "Młody Kraków",
      members: [user.id],
    });

    setChannel(channel);
  }, [client]);

  return (
    <>
      {client && channel && (
        <Chat client={client}>
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      )}
    </>
  );
}
