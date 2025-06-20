CREATE TABLE IF NOT EXISTS "notifications" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL,
  "type" varchar(50) NOT NULL,
  "message" text NOT NULL,
  "link" text,
  "metadata" json,
  "read" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);
