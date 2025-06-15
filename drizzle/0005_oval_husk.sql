CREATE TABLE "interests" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_user_id" integer NOT NULL,
	"to_user_id" integer NOT NULL,
	"message" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shortlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"shortlisted_user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "mother_tongue" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "height" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "profile_status" SET DEFAULT 'approved';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "education_details" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "job_title" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "marital_status_other" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "father_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mother_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "housing_status" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "siblings" json;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "brother_in_laws" json;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "maternal_paternal" json;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferred_occupation" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferred_height" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferred_complexion" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferred_maslak" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "show_contact_info" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "show_photos" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hide_profile" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "show_online_status" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "show_father_number" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "show_mother_number" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mobile_number" varchar(20);