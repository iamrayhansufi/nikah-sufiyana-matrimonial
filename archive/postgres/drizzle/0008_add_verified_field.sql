CREATE TABLE IF NOT EXISTS "temp_verification" (id SERIAL PRIMARY KEY);
ALTER TABLE IF EXISTS "users" ADD COLUMN IF NOT EXISTS "verified" boolean DEFAULT false;
DROP TABLE IF EXISTS "temp_verification";
