/*
  Warnings:

  - Added the required column `image` to the `Cocktail` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cocktail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "image" TEXT NOT NULL
);
INSERT INTO "new_Cocktail" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Cocktail";
DROP TABLE "Cocktail";
ALTER TABLE "new_Cocktail" RENAME TO "Cocktail";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
