/*
  Warnings:

  - You are about to drop the column `Price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "categoryType" ADD VALUE 'all';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "Price",
ADD COLUMN     "price" INTEGER NOT NULL,
ALTER COLUMN "category" DROP DEFAULT;
