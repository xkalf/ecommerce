CREATE TYPE "public"."common_type" AS ENUM('category', 'brand', 'banner');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "commons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"images" text,
	"parentId" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commons" ADD CONSTRAINT "commons_parentId_commons_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."commons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
