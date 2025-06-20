CREATE TABLE IF NOT EXISTS "verification_codes" (
  "id" serial PRIMARY KEY,
  "email" varchar(255) NOT NULL,
  "code" varchar(6) NOT NULL,
  "purpose" varchar(20) NOT NULL DEFAULT 'registration',
  "expires_at" timestamp NOT NULL,
  "is_used" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "verification_codes_email_idx" ON "verification_codes" ("email");
