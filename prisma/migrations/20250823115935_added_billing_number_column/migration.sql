/*
  Warnings:

  - A unique constraint covering the columns `[billingNumber]` on the table `Billing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `billingNumber` to the `Billing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Billing" ADD COLUMN     "billingNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Billing_billingNumber_key" ON "public"."Billing"("billingNumber");
