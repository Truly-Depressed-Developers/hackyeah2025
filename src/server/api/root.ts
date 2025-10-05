import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { profileRouter } from "./routers/profile";
import { volunteerRequestRouter } from "./routers/volunteerRequest";
import { applicationsRouter } from "./routers/applications";
import { eventRouter } from "./routers/event";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  volunteerRequest: volunteerRequestRouter,
  applications: applicationsRouter,
  event: eventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
