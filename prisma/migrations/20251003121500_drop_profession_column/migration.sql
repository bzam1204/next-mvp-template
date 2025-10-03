-- Drop deprecated profession column
ALTER TABLE "members"
DROP COLUMN IF EXISTS "profession";

