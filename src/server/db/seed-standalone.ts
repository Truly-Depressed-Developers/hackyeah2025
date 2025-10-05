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
      sql`TRUNCATE TABLE hackyeah2025_event RESTART IDENTITY CASCADE`,
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

    // Create some sample volunteer requests
    await db.insert(events).values([
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
        createdById: "test-user-2",
      },
      {
        name: "Pomoc w organizacji festynu dzielnicowego",
        description:
          "Poszukujemy wolontariuszy do pomocy przy organizacji festynu w dzielnicy Podgórze. Zadania obejmują obsługę stoisk, animacje dla dzieci i porządkowanie terenu.",
        organizerName: "Rada Dzielnicy Podgórze",
        tags: ["festyn", "dzielnica", "dzieci", "kultura"],
        latitude: 50.0335,
        longitude: 19.9697,
        startDate: new Date("2025-07-20T08:00:00Z"),
        endDate: new Date("2025-07-20T18:00:00Z"),
        workload: ["Pełne"],
        form: [
          "Weź udział w akcjach bezpośrednich",
          "Spotkaj się z mieszkańcami",
          "Dbaj o potrzeby dzielnicy",
        ],
        createdById: "test-user-2",
      },
      {
        name: "Sadzenie drzew w Lesie Wolskim",
        description:
          "Akcja sadzenia młodych drzew w Lesie Wolskim. Zapewniamy narzędzia i sadzonki. Potrzebne są osoby w dobrej kondycji fizycznej.",
        organizerName: "Las Miejski Kraków",
        tags: ["las", "sadzenie", "ekologia", "przyroda"],
        latitude: 50.0755,
        longitude: 19.8683,
        startDate: new Date("2025-03-15T08:00:00Z"),
        endDate: new Date("2025-03-15T16:00:00Z"),
        workload: ["Umiarkowane", "Pełne"],
        form: ["Weź udział w akcjach bezpośrednich"],
        createdById: "test-user-2",
      },
      {
        name: "Zbiórka żywności dla potrzebujących",
        description:
          "Organizujemy zbiórkę żywności przy głównych sklepach miasta. Potrzebujemy wolontariuszy do informowania mieszkańców i zbierania darów.",
        organizerName: "Caritas Kraków",
        tags: ["pomoc-społeczna", "żywność", "charytatywność"],
        latitude: 50.0647,
        longitude: 19.945,
        startDate: new Date("2025-12-15T10:00:00Z"),
        endDate: new Date("2025-12-15T18:00:00Z"),
        workload: ["Lekkie", "Umiarkowane"],
        form: ["Spotkaj się z mieszkańcami", "Dbaj o potrzeby dzielnicy"],
        createdById: "test-user-2",
      },
    ]);

    console.log("✅ Created sample events");

    // Create sample applications for the events
    await db.insert(applications).values([
      {
        volunteerId: 1, // First volunteer
        eventId: 1, // Park cleanup
        message:
          "Bardzo chętnie pomogę w sprzątaniu parku. Mam doświadczenie w akcjach ekologicznych.",
        status: "pending",
      },
      {
        volunteerId: 2, // Second volunteer
        eventId: 1, // Park cleanup
        message:
          "Mieszkam blisko parku i zależy mi na jego czystości. Mogę pomóc w weekendy.",
        status: "accepted",
      },
      {
        volunteerId: 1, // First volunteer
        eventId: 2, // Computer workshops
        message: "Pracuję w IT i chętnie pomogę seniorom z komputerami.",
        status: "accepted",
      },
      {
        volunteerId: 3, // Third volunteer (coordinator as volunteer too)
        eventId: 3, // Environmental campaign
        message:
          "Jako koordynator chcę też aktywnie uczestniczyć w kampaniach ekologicznych.",
        status: "pending",
      },
      {
        volunteerId: 2, // Second volunteer
        eventId: 4, // Festival assistance
        message: "Uwielbiam festiwale i chętnie pomogę w organizacji.",
        status: "rejected",
      },
      {
        volunteerId: 1, // First volunteer
        eventId: 5, // Online activism
        message:
          "Mam doświadczenie w mediach społecznościowych i kampaniach online.",
        status: "accepted",
      },
      {
        volunteerId: 3, // Third volunteer
        eventId: 6, // Community meetings
        message:
          "Interesuję się polityką lokalną i chętnie pomogę w organizacji spotkań.",
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
