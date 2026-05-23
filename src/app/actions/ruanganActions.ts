"use server";

import prisma from "@/lib/prisma";

// 1. Fungsi Ambil Semua Data Ruangan
export async function getRuangan() {
  try {
    const data = await prisma.ruangan.findMany({
      orderBy: { createdAt: "desc" },
    });
    return data;
  } catch (error) {
    console.error("Gagal mengambil data ruangan:", error);
    return [];
  }
}

export type RuanganData = Awaited<ReturnType<typeof getRuangan>>[0];

// 2. Fungsi Tambah Data Ruangan
export async function addRuangan(data: {
  nama: string;
  kapasitas: number;
  fasilitas: string;
  status: string;
}) {
  try {
    const newRuangan = await prisma.ruangan.create({
      data: {
        nama: data.nama,
        kapasitas: data.kapasitas,
        fasilitas: data.fasilitas,
        status: data.status,
      },
    });
    return { success: true, data: newRuangan };
  } catch (error) {
    console.error("Gagal menambah data ruangan:", error);
    return { success: false };
  }
}

// 3. Fungsi Hapus Data Ruangan
export async function deleteRuangan(id: number) {
  try {
    await prisma.ruangan.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus data ruangan:", error);
    return { success: false };
  }
}
