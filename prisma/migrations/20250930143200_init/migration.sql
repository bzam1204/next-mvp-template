-- CreateTable
CREATE TABLE "public"."heroes" (
    "hero_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "power" INTEGER NOT NULL,
    "alive" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "heroes_pkey" PRIMARY KEY ("hero_id")
);

-- CreateIndex
CREATE INDEX "heroes_name_idx" ON "public"."heroes"("name");
