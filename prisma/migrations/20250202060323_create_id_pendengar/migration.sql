/*
  Warnings:

  - The primary key for the `pendengar_online` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `pendengar_online` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(191) NOT NULL DEFAULT 'jumlah',
    ADD PRIMARY KEY (`id`);
