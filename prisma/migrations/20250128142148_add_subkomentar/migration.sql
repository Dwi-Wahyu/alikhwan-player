-- CreateTable
CREATE TABLE `artikel` (
    `id` VARCHAR(191) NOT NULL,
    `nomor` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_pengguna` VARCHAR(191) NULL,
    `thumbnail` VARCHAR(191) NULL,
    `dislike` INTEGER NOT NULL DEFAULT 0,
    `like` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `artikel_nomor_key`(`nomor`),
    INDEX `artikel_id_pengguna_fkey`(`id_pengguna`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_statistik` (
    `id` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `persentase` VARCHAR(191) NOT NULL,
    `id_statistik` VARCHAR(191) NULL,

    UNIQUE INDEX `data_statistik_kategori_key`(`kategori`),
    INDEX `data_statistik_id_statistik_fkey`(`id_statistik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `galeri` (
    `id` VARCHAR(191) NOT NULL,
    `urutan` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tampilkan` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `galeri_urutan_key`(`urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kata_sambutan` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `komentar` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `isi` VARCHAR(191) NOT NULL,
    `like` INTEGER NOT NULL DEFAULT 0,
    `dislike` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subkomentar` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `isi` VARCHAR(191) NOT NULL,
    `like` INTEGER NOT NULL DEFAULT 0,
    `dislike` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_komentar` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengguna` (
    `id` VARCHAR(191) NOT NULL,
    `nomor` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `pengguna_nomor_key`(`nomor`),
    UNIQUE INDEX `pengguna_username_key`(`username`),
    UNIQUE INDEX `pengguna_password_key`(`password`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_acara` (
    `id` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `mulai` VARCHAR(191) NOT NULL,
    `selesai` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,

    UNIQUE INDEX `program_acara_judul_key`(`judul`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statistik` (
    `id` VARCHAR(191) NOT NULL,
    `nama_statistik` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `statistik_nama_statistik_key`(`nama_statistik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `struktur` (
    `id` VARCHAR(191) NOT NULL,
    `urutan` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `gambar` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `struktur_urutan_key`(`urutan`),
    UNIQUE INDEX `struktur_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `artikel` ADD CONSTRAINT `artikel_id_pengguna_fkey` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `data_statistik` ADD CONSTRAINT `data_statistik_id_statistik_fkey` FOREIGN KEY (`id_statistik`) REFERENCES `statistik`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subkomentar` ADD CONSTRAINT `subkomentar_id_komentar_fkey` FOREIGN KEY (`id_komentar`) REFERENCES `komentar`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
