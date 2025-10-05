import { z } from "zod";
import { eq, sql } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { applications, events, volunteers, users } from "@/server/db/schema";

export const applicationsRouter = createTRPCRouter({
  getForCompany: protectedProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    const companyName = await ctx.db.query.companies
      .findFirst({
        where: (app, { eq }) => eq(app.userId, userId),
      })
      .then((company) => company?.companyName!);

    const result = await ctx.db
      .select({
        id: applications.id,
        volunteerId: applications.volunteerId,
        externalEventId: applications.externalEventId,
        eventTitle: applications.eventTitle,
        companyName: applications.companyName,
        message: applications.message,
        status: applications.status,
        createdAt: applications.createdAt,
        volunteerName:
          sql`${volunteers.firstName} || ' ' || ${volunteers.lastName}`.as(
            "volunteerName",
          ),
        volunteerEmail: users.email,
      })
      .from(applications)
      .innerJoin(volunteers, eq(applications.volunteerId, volunteers.id))
      .innerJoin(users, eq(volunteers.userId, users.id))
      .where(eq(applications.companyName, companyName))
      .orderBy(applications.createdAt);

    return result;
  }),

  getForExternalEvent: protectedProcedure
    .input(z.object({ externalEventId: z.string() }))
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
        .where(eq(applications.externalEventId, input.externalEventId))
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
        externalEventId: z.string(),
        eventTitle: z.string().optional(),
        companyName: z.string().optional(),
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
          externalEventId: input.externalEventId,
          eventTitle: input.eventTitle ?? null,
          companyName: input.companyName ?? null,
          message: input.message ?? null,
        })
        .returning();

      return result[0];
    }),
});
