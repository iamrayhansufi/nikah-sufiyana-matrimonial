ALTER TABLE "users" ADD COLUMN "role" varchar(20) NOT NULL DEFAULT 'user';

-- Add indexes for common queries
CREATE INDEX idx_users_role ON "users" ("role");
