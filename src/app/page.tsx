import Link from "next/link";

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Młody Kraków
            </h1>
            <p className="max-w-2xl text-center text-xl text-gray-300">
              Platforma łącząca wolontariuszy z organizatorami inicjatyw
              obywatelskich w Krakowie
            </p>
          </div>

          {!session ? (
            <div className="flex flex-col items-center gap-6">
              <p className="text-center text-lg text-gray-200">
                Dołącz do społeczności i znajdź inicjatywy, które Cię interesują
              </p>
              <div className="flex gap-4">
                <Link
                  href="/api/auth/signin"
                  className="rounded-full bg-white/10 px-8 py-3 font-semibold no-underline transition hover:bg-white/20"
                >
                  Zaloguj się
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-blue-600 px-8 py-3 font-semibold no-underline transition hover:bg-blue-700"
                >
                  Zarejestruj się
                </Link>
              </div>
            </div>
          ) : (
            // Content for authenticated users (coordinators who don't get redirected)
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-2xl text-white">
                  Witaj, {session.user?.name}!
                </p>
                <p className="text-center text-lg text-gray-200">
                  Rola: {session.user.role}
                </p>

                {session.user.role === "koordynator" && (
                  <div className="text-center">
                    <p className="mb-4 text-gray-300">
                      Jako koordynator masz dostęp do wszystkich funkcji
                      platformy
                    </p>
                    <div className="flex gap-4">
                      <Link
                        href="/find-event"
                        className="rounded-full bg-blue-600 px-6 py-2 font-semibold no-underline transition hover:bg-blue-700"
                      >
                        Znajdź inicjatywy
                      </Link>
                      <Link
                        href="/dashboard"
                        className="rounded-full bg-green-600 px-6 py-2 font-semibold no-underline transition hover:bg-green-700"
                      >
                        Panel zarządzania
                      </Link>
                    </div>
                  </div>
                )}

                <Link
                  href="/api/auth/signout"
                  className="rounded-full bg-white/10 px-6 py-2 font-semibold no-underline transition hover:bg-white/20"
                >
                  Wyloguj się
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
