-- CreateEnum
CREATE TYPE "sizesOption" AS ENUM ('small', 'large', 'medium', 'extralarge', 'doubleextralarge');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" "sizesOption" NOT NULL,
    "image" TEXT NOT NULL,
    "Price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");
