-- CreateEnum
CREATE TYPE "MemberClassification" AS ENUM ('communicant', 'non-communicant');

-- CreateEnum
CREATE TYPE "MemberVisibilityStatus" AS ENUM ('active', 'archived');

-- CreateEnum
CREATE TYPE "MemberSex" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "MemberMaritalStatus" AS ENUM ('single', 'married', 'divorced', 'widowed');

-- CreateEnum
CREATE TYPE "MemberReceptionMode" AS ENUM ('profession_of_faith', 'transfer', 'restoration');

-- CreateTable
CREATE TABLE "members" (
    "member_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "cpf" TEXT,
    "profile" TEXT,
    "classification" "MemberClassification" NOT NULL,
    "status" "MemberVisibilityStatus" NOT NULL,
    "sex" "MemberSex" NOT NULL,
    "marital_status" "MemberMaritalStatus" NOT NULL,
    "birth_date" DATE NOT NULL,
    "place_of_birth" TEXT NOT NULL,
    "literacy" BOOLEAN NOT NULL,
    "profession" TEXT NOT NULL,
    "religious_background" TEXT NOT NULL,
    "baptized_in_infancy" BOOLEAN NOT NULL,
    "reception_date" TIMESTAMP(3) NOT NULL,
    "reception_mode" "MemberReceptionMode" NOT NULL,
    "reception_location" TEXT NOT NULL,
    "celebrant" TEXT NOT NULL,
    "address_street" TEXT NOT NULL,
    "address_number" TEXT,
    "address_district" TEXT,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT,
    "address_zip" TEXT,
    "address_complement" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("member_id")
);

-- CreateIndex
CREATE INDEX "members_full_name_idx" ON "members"("full_name");

-- CreateIndex
CREATE INDEX "members_status_idx" ON "members"("status");

-- CreateIndex
CREATE INDEX "members_profile_idx" ON "members"("profile");
