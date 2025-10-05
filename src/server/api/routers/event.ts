import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { applications } from "@/server/db/schema";

const eventInputSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
});

export const eventRouter = createTRPCRouter({
  getEvents: protectedProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.query.events.findMany();
    return events;
  }),

  signUpForEvent: protectedProcedure
    .input(eventInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const volunteerId =
        (await ctx.db.query.volunteers
          .findFirst({
            where: (volunteer, { eq }) => eq(volunteer.userId, userId),
          })
          .then((volunteer) => volunteer?.id)) || 0;

      console.log(input.eventId);

      const existing = await ctx.db.query.applications.findFirst({
        where: (app, { eq }) =>
          eq(app.externalEventId, input.eventId) &&
          eq(app.volunteerId, volunteerId),
      });

      if (existing) {
        throw new Error("Już zgłosiłeś się na to wydarzenie");
      }

      console.log("Signing up for event:", { input, volunteerId, userId });

      await ctx.db.transaction(async (tx) => {
        await tx.insert(applications).values({
          externalEventId: input.eventId,
          volunteerId: volunteerId,
          status: "pending",
        });
      });
      return { success: true };
    }),
});
