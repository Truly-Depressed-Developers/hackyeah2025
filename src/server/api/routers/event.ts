import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const eventRouter = createTRPCRouter({
  getEvents: protectedProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.query.events.findMany();
    return events;
  }),
});
