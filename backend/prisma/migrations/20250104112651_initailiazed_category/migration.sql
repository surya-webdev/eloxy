-- CreateEnum
CREATE TYPE "categoryType" AS ENUM ('topwear', 'bottomwear', 'footwear');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "bestsellor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category" "categoryType" NOT NULL DEFAULT 'topwear';
