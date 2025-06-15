-- Modify users table to allow null values for height
ALTER TABLE users ALTER COLUMN height DROP NOT NULL;
