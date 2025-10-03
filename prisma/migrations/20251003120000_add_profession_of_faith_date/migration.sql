-- Add profession_of_faith_date to members
ALTER TABLE "members"
ADD COLUMN IF NOT EXISTS "profession_of_faith_date" DATE;

