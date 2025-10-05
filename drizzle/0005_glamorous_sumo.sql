ALTER TABLE "hackyeah2025_application" DROP CONSTRAINT "hackyeah2025_application_eventId_hackyeah2025_event_id_fk";
--> statement-breakpoint
ALTER TABLE "hackyeah2025_application" ALTER COLUMN "eventId" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "hackyeah2025_application" ALTER COLUMN "eventId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hackyeah2025_application" ADD CONSTRAINT "hackyeah2025_application_eventId_hackyeah2025_event_externalId_fk" FOREIGN KEY ("eventId") REFERENCES "public"."hackyeah2025_event"("externalId") ON DELETE no action ON UPDATE no action;