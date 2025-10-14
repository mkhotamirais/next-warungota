/*
  Warnings:

  - You are about to drop the column `cityId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `districtId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `provinceId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `regencyId` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Address" DROP COLUMN "cityId",
DROP COLUMN "districtId",
DROP COLUMN "provinceId",
DROP COLUMN "regencyId";
