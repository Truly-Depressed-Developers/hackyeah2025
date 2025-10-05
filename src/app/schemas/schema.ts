import { z } from "zod";

export const profileSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("wolontariusz"),
    firstName: z.string(),
    lastName: z.string(),
    isOfAge: z.boolean().optional(),
  }),
  z.object({
    role: z.literal("organizator"),
    description: z.string().optional(),
    companyName: z.string(),
    location: z.string(),
  }),
  z.object({
    role: z.literal("koordynator"),
    firstName: z.string(),
    lastName: z.string(),
    schoolName: z.string(),
  }),
]);

export type Profile = z.infer<typeof profileSchema>;
