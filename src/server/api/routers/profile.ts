// src/server/api/routers/profile.ts

import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users, volunteers, companies, coordinators } from "@/server/db/schema";
import type { UserRole } from "@/server/db/types";

// Schemat walidacji Zod, który będzie używany zarówno na serwerze, jak i na kliencie
// To jest jedna z największych zalet tRPC!
const profileInputSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("wolontariusz"),
    firstName: z.string().min(2, "Imię jest wymagane"),
    lastName: z.string().min(2, "Nazwisko jest wymagane"),
    isOfAge: z.boolean().optional(),
  }),
  z.object({
    role: z.literal("organizator"),
    companyName: z.string().min(2, "Nazwa firmy jest wymagana"),
    location: z.string().min(3, "Lokalizacja jest wymagana"),
    description: z.string().optional(),
  }),
  z.object({
    role: z.literal("koordynator"),
    firstName: z.string().min(2, "Imię jest wymagane"),
    lastName: z.string().min(2, "Nazwisko jest wymagane"),
    school: z.string().min(2, "Nazwa szkoły jest wymagana"),
  }),
]);

export const profileRouter = createTRPCRouter({
  // Definiujemy mutację, czyli operację, która zmienia dane
  complete: protectedProcedure // Używamy `protectedProcedure`, aby upewnić się, że tylko zalogowani użytkownicy mogą ją wywołać
    .input(profileInputSchema) // Automatyczna walidacja danych wejściowych
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Używamy transakcji, aby zapewnić spójność danych.
      // Albo wszystkie operacje się powiodą, albo żadna.
      await ctx.db.transaction(async (tx) => {
        // 1. Aktualizujemy tabelę `users`
        await tx
          .update(users)
          .set({
            role: input.role as UserRole,
            profileCompleted: true,
          })
          .where(eq(users.id, userId));

        // 2. Wstawiamy dane do odpowiedniej tabeli w zależności od roli
        switch (input.role) {
          case "wolontariusz":
            await tx.insert(volunteers).values({
              userId,
              firstName: input.firstName,
              lastName: input.lastName,
              isOfAge: input.isOfAge,
            });
            break;
          case "organizator":
            await tx.insert(companies).values({
              userId,
              companyName: input.companyName,
              location: input.location,
              description: input.description,
            });
            break;
          case "koordynator":
            await tx.insert(coordinators).values({
              userId,
              firstName: input.firstName,
              lastName: input.lastName,
              school: input.school,
            });
            break;
        }
      });

      return { success: true };
    }),
});
