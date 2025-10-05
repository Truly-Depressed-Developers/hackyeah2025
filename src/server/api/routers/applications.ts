import { z } from "zod";
import { eq, and } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { applications, events, volunteers, users } from "@/server/db/schema";

export const applicationsRouter = createTRPCRouter({
  getForCompany: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        id: applications.id,
        volunteerId: applications.volunteerId,
        eventId: applications.eventId,
        message: applications.message,
        status: applications.status,
        createdAt: applications.createdAt,
        volunteerName: users.name,
        volunteerEmail: users.email,
        eventName: events.name,
        eventDate: events.startDate,
      })
      .from(applications)
      .innerJoin(volunteers, eq(applications.volunteerId, volunteers.id))
      .innerJoin(users, eq(volunteers.userId, users.id))
      .innerJoin(events, eq(applications.eventId, events.id))
      .where(eq(events.createdById, "test-user-2"))
      .orderBy(applications.createdAt);

    return result;
  }),

  getForEvent: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          id: applications.id,
          volunteerId: applications.volunteerId,
          message: applications.message,
          status: applications.status,
          createdAt: applications.createdAt,
          volunteerName: users.name,
          volunteerEmail: users.email,
        })
        .from(applications)
        .innerJoin(volunteers, eq(applications.volunteerId, volunteers.id))
        .innerJoin(users, eq(volunteers.userId, users.id))
        .innerJoin(events, eq(applications.eventId, events.id))
        .where(
          and(
            eq(applications.eventId, input.eventId),
            eq(events.createdById, ctx.session.user.id),
          ),
        )
        .orderBy(applications.createdAt);

      return result;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        applicationId: z.number(),
        status: z.enum(["accepted", "rejected", "pending"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const application = await ctx.db
        .select({
          eventCreatedById: events.createdById,
        })
        .from(applications)
        .innerJoin(events, eq(applications.eventId, events.id))
        .where(eq(applications.id, input.applicationId))
        .limit(1);

      if (
        !application[0] ||
        application[0].eventCreatedById !== ctx.session.user.id
      ) {
        throw new Error("Unauthorized to update this application");
      }

      const result = await ctx.db
        .update(applications)
        .set({ status: input.status })
        .where(eq(applications.id, input.applicationId))
        .returning();

      return result[0];
    }),

  create: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        message: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const volunteer = await ctx.db
        .select()
        .from(volunteers)
        .where(eq(volunteers.userId, ctx.session.user.id))
        .limit(1);

      if (!volunteer[0]) {
        throw new Error(
          "User must have a volunteer profile to apply for events",
        );
      }

      const result = await ctx.db
        .insert(applications)
        .values({
          volunteerId: volunteer[0].id,
          eventId: input.eventId,
          message: input.message ?? null,
        })
        .returning();

      return result[0];
    }),
});
