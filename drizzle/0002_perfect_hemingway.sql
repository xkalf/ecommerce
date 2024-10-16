ALTER TABLE "commons" DROP CONSTRAINT "commons_parentId_commons_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commons" ADD CONSTRAINT "commons_parentId_commons_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."commons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
