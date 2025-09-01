/*
  Warnings:

  - You are about to drop the column `module` on the `Permission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[moduleId,submoduleId,action]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Permission_module_action_key";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "module",
ADD COLUMN     "moduleId" TEXT,
ADD COLUMN     "submoduleId" TEXT;

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submodule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submodule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Submodule_moduleId_name_key" ON "Submodule"("moduleId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_moduleId_submoduleId_action_key" ON "Permission"("moduleId", "submoduleId", "action");

-- AddForeignKey
ALTER TABLE "Submodule" ADD CONSTRAINT "Submodule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_submoduleId_fkey" FOREIGN KEY ("submoduleId") REFERENCES "Submodule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
