-- AlterTable
ALTER TABLE "public"."Apartment" ADD COLUMN     "landlordId" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "apartmentId" TEXT;

-- CreateTable
CREATE TABLE "public"."Landlord" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "profileImage" TEXT,
    "companyName" TEXT,
    "companyRegNo" TEXT,
    "bankAccount" TEXT,
    "taxId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Landlord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Landlord_userId_key" ON "public"."Landlord"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Landlord_email_key" ON "public"."Landlord"("email");

-- AddForeignKey
ALTER TABLE "public"."Apartment" ADD CONSTRAINT "Apartment_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "public"."Landlord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Landlord" ADD CONSTRAINT "Landlord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "public"."Apartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
