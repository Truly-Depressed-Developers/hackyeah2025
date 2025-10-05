import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { events } from "@/server/db/schema";

const createVolunteerRequestSchema = z.object({
  name: z.string().min(2, "Nazwa jest wymagana"),
  description: z.string().min(10, "Opis jest wymagany"),
  organizerName: z.string().min(2, "Nazwa organizatora jest wymagana"),
  tags: z.array(z.string()),
  thumbnail: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  workload: z.array(z.enum(["Mini", "Lekkie", "Umiarkowane", "Pełne"])),
  form: z.array(
    z.enum([
      "Zostań aktywistą online",
      "Dbaj o potrzeby dzielnicy",
      "Weź udział w akcjach bezpośrednich",
      "Spotkaj się z mieszkańcami",
      "Zaangażuj się w obywatelską kontrolę",
      "Wesprzyj pogotowie obywatelskie",
    ]),
  ),
});

export const volunteerRequestRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createVolunteerRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(events)
        .values({
          name: input.name,
          description: input.description,
          organizerName: input.organizerName,
          tags: input.tags,
          thumbnail: input.thumbnail ?? null,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          startDate: input.startDate ?? null,
          endDate: input.endDate ?? null,
          workload: input.workload,
          form: input.form,
          createdById: ctx.session.user.id,
        })
        .returning();

      return result[0];
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.events.findMany({
      orderBy: (events, { desc }) => [desc(events.createdAt)],
      with: {
        createdBy: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.query.events.findFirst({
        where: eq(events.id, input.id),
        with: {
          createdBy: {
            columns: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      return event;
    }),
});
