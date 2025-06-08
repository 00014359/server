-- CreateEnum
CREATE TYPE "SEASON" AS ENUM ('SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'ALL_SEASONS');

-- CreateEnum
CREATE TYPE "OCCASION" AS ENUM ('DAILY', 'EVENING', 'SPECIAL', 'WORK', 'CASUAL');

-- CreateEnum
CREATE TYPE "INTENSITY" AS ENUM ('LIGHT', 'MODERATE', 'STRONG', 'VERY_STRONG');

-- CreateEnum
CREATE TYPE "FRAGRANCE_FAMILY" AS ENUM ('FLORAL', 'ORIENTAL', 'WOODY', 'FRESH', 'CHYPRE', 'FOUGERE', 'GOURMAND');

-- AlterTable
ALTER TABLE "Perfume" ADD COLUMN     "baseNotes" TEXT[],
ADD COLUMN     "fragranceFamily" "FRAGRANCE_FAMILY",
ADD COLUMN     "intensity" "INTENSITY",
ADD COLUMN     "longevity" INTEGER,
ADD COLUMN     "middleNotes" TEXT[],
ADD COLUMN     "occasion" "OCCASION",
ADD COLUMN     "season" "SEASON",
ADD COLUMN     "sillage" INTEGER,
ADD COLUMN     "topNotes" TEXT[];

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "preferredGender" "GENDER" NOT NULL,
    "favoriteSeasons" "SEASON"[],
    "preferredOccasions" "OCCASION"[],
    "intensityPreference" "INTENSITY" NOT NULL,
    "fragranceFamilies" "FRAGRANCE_FAMILY"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
