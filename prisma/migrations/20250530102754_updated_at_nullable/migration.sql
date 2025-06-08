/*
  Warnings:

  - The values [UNISEX] on the enum `GENDER` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Perfume` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GENDER_new" AS ENUM ('MALE', 'FEMALE');
ALTER TABLE "Perfume" ALTER COLUMN "gender" DROP DEFAULT;
ALTER TABLE "Perfume" ALTER COLUMN "gender" TYPE "GENDER_new" USING ("gender"::text::"GENDER_new");
ALTER TYPE "GENDER" RENAME TO "GENDER_old";
ALTER TYPE "GENDER_new" RENAME TO "GENDER";
DROP TYPE "GENDER_old";
ALTER TABLE "Perfume" ALTER COLUMN "gender" SET DEFAULT 'FEMALE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_perfumeId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "perfumeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Order_id_seq";

-- AlterTable
ALTER TABLE "Perfume" DROP CONSTRAINT "Perfume_pkey",
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Perfume_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Perfume_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_perfumeId_fkey" FOREIGN KEY ("perfumeId") REFERENCES "Perfume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
