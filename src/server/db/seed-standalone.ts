import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  events,
  users,
  volunteers,
  companies,
  coordinators,
  applications,
} from "./schema";
import { config } from "dotenv";
import { sql } from "drizzle-orm";

// Load environment variables from .env file
config();

// Create a direct database connection for seeding
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL environment variable is required");
  console.error("Please set DATABASE_URL in your environment or .env file");
  process.exit(1);
}

const conn = postgres(databaseUrl);
const db = drizzle(conn);

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data in correct order to respect foreign key constraints
    console.log("🗑️ Clearing existing data...");
    await db.execute(
      sql`TRUNCATE TABLE hackyeah2025_application RESTART IDENTITY CASCADE`,
    );
    await db.execute(
      sql`TRUNCATE TABLE hackyeah2025_volunteer RESTART IDENTITY CASCADE`,
    );
    await db.execute(
      sql`TRUNCATE TABLE hackyeah2025_company RESTART IDENTITY CASCADE`,
    );
    await db.execute(
      sql`TRUNCATE TABLE hackyeah2025_coordinator RESTART IDENTITY CASCADE`,
    );
    await db.execute(
      sql`TRUNCATE TABLE hackyeah2025_user RESTART IDENTITY CASCADE`,
    );
    console.log("✅ Cleared existing data");

    // Create some test users
    await db.insert(users).values([
      {
        id: "test-user-1",
        name: "Jan Kowalski",
        email: "jan.kowalski@example.com",
        role: "wolontariusz",
        profileCompleted: true,
      },
      {
        id: "test-user-2",
        name: "Fundacja Kraków",
        email: "kontakt@fundacjakrakow.pl",
        role: "organizacja",
        profileCompleted: true,
      },
      {
        id: "test-user-3",
        name: "Anna Nowak",
        email: "anna.nowak@szkola.edu.pl",
        role: "koordynator",
        profileCompleted: true,
      },
      {
        id: "test-user-4",
        name: "Maria Wójcik",
        email: "maria.wojcik@example.com",
        role: "wolontariusz",
        profileCompleted: true,
      },
      {
        id: "test-user-5",
        name: "Piotr Zieliński",
        email: "piotr.zielinski@example.com",
        role: "wolontariusz",
        profileCompleted: true,
      },
    ]);

    console.log("✅ Created test users");

    // Create profiles for users
    await db.insert(volunteers).values([
      {
        userId: "test-user-1",
        firstName: "Jan",
        lastName: "Kowalski",
        isOfAge: true,
      },
      {
        userId: "test-user-4",
        firstName: "Maria",
        lastName: "Wójcik",
        isOfAge: true,
      },
      {
        userId: "test-user-5",
        firstName: "Piotr",
        lastName: "Zieliński",
        isOfAge: true,
      },
    ]);

    await db.insert(companies).values({
      userId: "test-user-2",
      companyName: "Fundacja Kraków",
      location: "Kraków, Rynek Główny 1",
      description:
        "Organizacja non-profit działająca na rzecz rozwoju miasta Kraków",
    });

    await db.insert(coordinators).values({
      userId: "test-user-3",
      firstName: "Anna",
      lastName: "Nowak",
      school: "Liceum im. Kopernika",
    });

    console.log("✅ Created user profiles");

    // Create sample events locally (these would normally come from external API)
    const sampleEvents = await db
      .insert(events)
      .values([
        {
          name: "Sprzątanie Parku Jordana",
          description:
            "Wspólne sprzątanie parku przed weekendem majowym. Potrzebujemy wolontariuszy do zbierania śmieci, grabienia liści i drobnych prac porządkowych.",
          organizerName: "Fundacja Kraków",
          tags: ["ekologia", "park", "sprzatanie"],
          latitude: 50.0614,
          longitude: 19.9365,
          startDate: new Date("2025-04-27T09:00:00Z"),
          endDate: new Date("2025-04-27T15:00:00Z"),
          workload: ["Lekkie"],
          form: [
            "Weź udział w akcjach bezpośrednich",
            "Spotkaj się z mieszkańcami",
          ],
          externalId: "ext-event-001",
          syncStatus: "synced",
          lastSyncedAt: new Date(),
          createdById: "test-user-2",
        },
        {
          name: "Warsztaty komputerowe dla seniorów",
          description:
            "Pomóż seniorom w nauce obsługi komputera i internetu. Mile widziana cierpliwość i podstawowa znajomość technologii.",
          organizerName: "Centrum Seniora",
          tags: ["seniorzy", "edukacja", "technologia"],
          latitude: 50.0647,
          longitude: 19.945,
          startDate: new Date("2025-05-15T14:00:00Z"),
          endDate: new Date("2025-05-15T17:00:00Z"),
          workload: ["Umiarkowane"],
          form: ["Spotkaj się z mieszkańcami", "Dbaj o potrzeby dzielnicy"],
          externalId: "ext-event-002",
          syncStatus: "synced",
          lastSyncedAt: new Date(),
          createdById: "test-user-2",
        },
        {
          name: "Kampania edukacyjna o segregacji śmieci",
          description:
            "Dołącz do kampanii informacyjnej o właściwej segregacji odpadów. Będziemy rozdawać ulotki i rozmawiać z mieszkańcami o ekologii.",
          organizerName: "EkoKraków",
          tags: ["ekologia", "edukacja", "segregacja"],
          latitude: 50.0619,
          longitude: 19.937,
          startDate: new Date("2025-06-01T10:00:00Z"),
          endDate: new Date("2025-06-01T14:00:00Z"),
          workload: ["Mini", "Lekkie"],
          form: ["Zostań aktywistą online", "Spotkaj się z mieszkańcami"],
          externalId: "ext-event-003",
          syncStatus: "synced",
          lastSyncedAt: new Date(),
          createdById: "test-user-2",
        },
      ])
      .returning();

    console.log("✅ Created sample events");

    // Create sample applications with both local and external references
    await db.insert(applications).values([
      {
        volunteerId: 1,
        eventId: sampleEvents[0]?.id, // Local event reference
        externalEventId: "ext-event-001",
        eventTitle: "Sprzątanie Parku Jordana",
        companyName: "Fundacja Kraków",
        message:
          "Bardzo chętnie pomogę w sprzątaniu parku. Mam doświadczenie w akcjach ekologicznych.",
        status: "pending",
      },
      {
        volunteerId: 2,
        eventId: sampleEvents[0]?.id,
        externalEventId: "ext-event-001",
        eventTitle: "Sprzątanie Parku Jordana",
        companyName: "Fundacja Kraków",
        message:
          "Mieszkam blisko parku i zależy mi na jego czystości. Mogę pomóc w weekendy.",
        status: "accepted",
      },
      {
        volunteerId: 1,
        eventId: sampleEvents[1]?.id,
        externalEventId: "ext-event-002",
        eventTitle: "Warsztaty komputerowe dla seniorów",
        companyName: "Centrum Seniora",
        message: "Pracuję w IT i chętnie pomogę seniorom z komputerami.",
        status: "accepted",
      },
      {
        volunteerId: 3,
        eventId: sampleEvents[2]?.id,
        externalEventId: "ext-event-003",
        eventTitle: "Kampania edukacyjna o segregacji śmieci",
        companyName: "EkoKraków",
        message:
          "Jako koordynator chcę też aktywnie uczestniczyć w kampaniach ekologicznych.",
        status: "pending",
      },
    ]);

    console.log("✅ Created sample applications");
    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await conn.end();
  }
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
