/*
  Warnings:

  - Added the required column `replyTo` to the `subkomentar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subkomentar` ADD COLUMN `replyTo` VARCHAR(191) NOT NULL;
