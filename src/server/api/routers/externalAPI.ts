import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { events } from "@/server/db/schema";
import axios from "axios";
import { z } from "zod";

const createOpportunitySchema = z.object({
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

export const externalAPIRouter = createTRPCRouter({
  validatePayload: protectedProcedure
    .input(createOpportunitySchema)
    .mutation(async ({ input }) => {
      const workloadMap: Record<string, string> = {
        Mini: "Mini - Zaangażowanie do 1 godziny tygodniowo",
        Lekkie: "Lekkie - Zaangażowanie 1-4 godziny tygodniowo",
        Umiarkowane: "Umiarkowane - Zaangażowanie 4-8 godzin tygodniowo",
        Pełne: "Pełne - Zaangażowanie ponad 8 godzin tygodniowo",
      };

      const tagMap: Record<string, string> = {
        "rynek-mieszkaniowy": "Rynek mieszkaniowy",
        "zielen-klimat": "Zieleń i klimat",
        "jakosc-powietrza": "Jakość powietrza",
        "potrzeby-kierowcow": "Potrzeby kierowców",
        "potrzeby-rowerzystow": "Potrzeby rowerzystów",
        "potrzeby-pieszych": "Potrzeby pieszych",
        "komunikacja-miejska": "Komunikacja miejska",
        edukacja: "Edukacja",
        zdrowie: "Zdrowie",
        "oferta-spoleczno-kulturalna": "Oferta społeczno-kulturalna miasta",
        zwierzeta: "Zwierzęta",
        seniorzy: "Seniorzy i seniorki",
        transparentnosc: "Transparentność działań urzędów",
        "uslugi-komunalne": "Usługi komunalne (np. woda, śmieci)",
      };

      const payload = {
        title: input.name,
        description: input.description,
        tags: input.tags.map((tag) => tagMap[tag] ?? tag),
        thumbnail: input.thumbnail ?? null,
        lon: input.longitude ?? null,
        lat: input.latitude ?? null,
        start_date: input.startDate
          ? input.startDate.toISOString().split("T")[0]
          : null,
        end_date: input.endDate
          ? input.endDate.toISOString().split("T")[0]
          : null,
        workload: input.workload.map((w) => workloadMap[w] ?? w),
        form: input.form,
        organizer: input.organizerName,
      };

      console.log(
        "Validation - Generated payload:",
        JSON.stringify(payload, null, 2),
      );

      return {
        success: true,
        payload,
        message: "Payload validation successful",
      };
    }),

  createOpportunity: protectedProcedure
    .input(createOpportunitySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const workloadMap: Record<string, string> = {
          Mini: "Mini - Zaangażowanie do 1 godziny tygodniowo",
          Lekkie: "Lekkie - Zaangażowanie 1-4 godziny tygodniowo",
          Umiarkowane: "Umiarkowane - Zaangażowanie 4-8 godzin tygodniowo",
          Pełne: "Pełne - Zaangażowanie ponad 8 godzin tygodniowo",
        };

        const tagMap: Record<string, string> = {
          "rynek-mieszkaniowy": "Rynek mieszkaniowy",
          "zielen-klimat": "Zieleń i klimat",
          "jakosc-powietrza": "Jakość powietrza",
          "potrzeby-kierowcow": "Potrzeby kierowców",
          "potrzeby-rowerzystow": "Potrzeby rowerzystów",
          "potrzeby-pieszych": "Potrzeby pieszych",
          "komunikacja-miejska": "Komunikacja miejska",
          edukacja: "Edukacja",
          zdrowie: "Zdrowie",
          "oferta-spoleczno-kulturalna": "Oferta społeczno-kulturalna miasta",
          zwierzeta: "Zwierzęta",
          seniorzy: "Seniorzy i seniorki",
          transparentnosc: "Transparentność działań urzędów",
          "uslugi-komunalne": "Usługi komunalne (np. woda, śmieci)",
        };

        const payload = {
          title: input.name,
          description: input.description,
          tags: input.tags.map((tag) => tagMap[tag] ?? tag),
          thumbnail: input.thumbnail ?? null,
          lon: input.longitude ?? null,
          lat: input.latitude ?? null,
          start_date: input.startDate
            ? input.startDate.toISOString().split("T")[0]
            : null,
          end_date: input.endDate
            ? input.endDate.toISOString().split("T")[0]
            : null,
          workload: input.workload.map((w) => workloadMap[w] ?? w),
          form: input.form,
          organizer: input.organizerName,
        };

        console.log("Sending payload to external API:", payload);

        const requiredFields = ["title", "description", "organizer"];
        const missingFields = requiredFields.filter(
          (field) => !payload[field as keyof typeof payload],
        );
        if (missingFields.length > 0) {
          throw new Error(
            `Missing required fields: ${missingFields.join(", ")}`,
          );
        }

        const response = await axios.post(env.EXTERNAL_API_URL, payload, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.EXTERNAL_API_KEY,
          },
          timeout: 10000,
        });

        console.log("External API response:", response.data);

        const externalId =
          response.data &&
          typeof response.data === "object" &&
          "id" in response.data
            ? String((response.data as { id: unknown }).id)
            : `ext-${Date.now()}`;

        const localEvent = await ctx.db
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
            externalId,
            syncStatus: "synced",
            lastSyncedAt: new Date(),
            createdById: ctx.session.user.id,
          })
          .returning();

        console.log("Local event created:", localEvent[0]);

        return {
          success: true,
          message: "Ogłoszenie zostało pomyślnie utworzone!",
          externalId,
          localEventId: localEvent[0]?.id,
        };
      } catch (error) {
        console.error("Error calling external API:", error);

        try {
          const fallbackEvent = await ctx.db
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
              externalId: null,
              syncStatus: "pending",
              lastSyncedAt: null,
              createdById: ctx.session.user.id,
            })
            .returning();

          console.log("Fallback local event created:", fallbackEvent[0]);

          return {
            success: false,
            message: "External API failed, saved locally for later sync",
            localEventId: fallbackEvent[0]?.id,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        } catch (dbError) {
          console.error("Database fallback also failed:", dbError);
        }

        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error("API Error Response:", {
              status: error.response.status,
              statusText: error.response.statusText,
              headers: error.response.headers,
            });

            let errorMessage = error.message;
            if (error.response.data) {
              if (typeof error.response.data === "string") {
                errorMessage = error.response.data;
              } else if (typeof error.response.data === "object") {
                errorMessage = JSON.stringify(error.response.data, null, 2);
              }
            }

            throw new Error(
              `API Error (${error.response.status}): ${errorMessage}`,
            );
          } else if (error.request) {
            throw new Error(
              "Nie udało się połączyć z zewnętrznym API. Sprawdź połączenie internetowe.",
            );
          } else {
            throw new Error(`Błąd podczas wysyłania żądania: ${error.message}`);
          }
        }

        throw new Error("Nieoczekiwany błąd podczas tworzenia ogłoszenia");
      }
    }),
});
