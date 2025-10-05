// src/server/db/seed.ts
import { db } from "@/server/db"; // upewnij się, że masz ten eksport w /db/index.ts
import { users, events, volunteers } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Starting seed...");

  // 1️⃣ Usuń istniejące dane (opcjonalnie)
  await db.delete(events);
  await db.delete(volunteers);

  // 2️⃣ Dodaj przykładowych użytkowników
  const [user1, user2] = await db
    .insert(users)
    .values([
      {
        id: "user-1",
        name: "Jan Kowalski",
        email: "jan.kowalski@example.com",
        role: "wolontariusz",
        profileCompleted: true,
      },
      {
        id: "user-2",
        name: "Anna Nowak",
        email: "anna.nowak@example.com",
        role: "koordynator",
        profileCompleted: true,
      },
    ])
    .returning();

  // 3️⃣ Dodaj wolontariuszy powiązanych z użytkownikami
  const [vol1, vol2] = await db
    .insert(volunteers)
    .values([
      {
        userId: user1.id,
        firstName: "Jan",
        lastName: "Kowalski",
        isOfAge: true,
      },
      {
        userId: user2.id,
        firstName: "Anna",
        lastName: "Nowak",
        isOfAge: true,
      },
    ])
    .returning();

  // 4️⃣ Dodaj przykładowe eventy
  await db.insert(events).values([
    {
      name: "Sprzątanie parku miejskiego",
      description:
        "Wspólna akcja sprzątania parku i okolicznych terenów zielonych.",
      organizerName: "Fundacja Zielona Ziemia",
      tags: ["środowisko", "społeczność", "natura"],
      thumbnail: "https://example.com/park.jpg",
      latitude: 52.2297,
      longitude: 21.0122,
      startDate: new Date("2025-10-20T10:00:00Z"),
      endDate: new Date("2025-10-20T16:00:00Z"),
      workload: ["Lekkie", "Umiarkowane"],
      form: ["Weź udział w akcjach bezpośrednich"],
      createdById: user2.id,
    },
    {
      name: "Zbiórka żywności dla potrzebujących",
      description:
        "Pomoc w zbiórce i dystrybucji żywności w lokalnym centrum pomocy.",
      organizerName: "Bank Żywności Warszawa",
      tags: ["pomoc", "społeczność", "żywność"],
      thumbnail: "https://example.com/food.jpg",
      latitude: 52.4064,
      longitude: 16.9252,
      startDate: new Date("2025-10-25T09:00:00Z"),
      endDate: new Date("2025-10-25T18:00:00Z"),
      workload: ["Pełne"],
      form: ["Dbaj o potrzeby dzielnicy"],
      createdById: user1.id,
    },
  ]);

  console.log("✅ Seed completed!");
}

main()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(() => process.exit());
