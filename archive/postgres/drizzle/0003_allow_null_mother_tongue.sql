-- Modify users table to allow null values for mother_tongue
ALTER TABLE users ALTER COLUMN mother_tongue DROP NOT NULL;
