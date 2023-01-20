/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Garnish` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type]` on the table `Ice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Garnish_name_key" ON "Garnish"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ice_type_key" ON "Ice"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");
