-- Make profession column nullable to deprecate job profession field
ALTER TABLE "members"
ALTER COLUMN "profession" DROP NOT NULL;

