ALTER TABLE "hackyeah2025_event" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "hackyeah2025_event" CASCADE;--> statement-breakpoint
ALTER TABLE "hackyeah2025_application" ADD COLUMN "externalEventId" varchar(255);--> statement-breakpoint
ALTER TABLE "hackyeah2025_application" ADD COLUMN "eventTitle" varchar(255);--> statement-breakpoint
ALTER TABLE "hackyeah2025_application" ADD COLUMN "companyName" varchar(255);--> statement-breakpoint
UPDATE "hackyeah2025_application" SET "externalEventId" = CAST("eventId" AS varchar) WHERE "externalEventId" IS NULL;--> statement-breakpoint
ALTER TABLE "hackyeah2025_application" ALTER COLUMN "externalEventId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hackyeah2025_application" DROP COLUMN "eventId";