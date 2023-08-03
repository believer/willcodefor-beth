-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "PostView" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"postId" text NOT NULL,
	"userAgent" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Post" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"excerpt" text NOT NULL,
	"slug" text NOT NULL,
	"series" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"tilId" integer NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"longSlug" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	CONSTRAINT "slug_unique" UNIQUE("slug"),
	CONSTRAINT "longslug_unique" UNIQUE("longSlug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Post_Tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"tag_id" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "PostView_postId_idx" ON "PostView" ("postId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Tag_name_key" ON "Tag" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Post_Tag_post_id_idx" ON "Post_Tag" ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Post_Tag_tag_id_idx" ON "Post_Tag" ("tag_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PostView" ADD CONSTRAINT "PostView_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post_Tag" ADD CONSTRAINT "Post_Tag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post_Tag" ADD CONSTRAINT "Post_Tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/