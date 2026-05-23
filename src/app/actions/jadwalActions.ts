"use server";

import prisma from "@/lib/prisma";

// 1. Fungsi Ambil Semua Data
export async function getJadwal() {
  try {
    const data = await prisma.jadwal.findMany({
      orderBy: { createdAt: "desc" },
      // Pilih HANYA kolom yang dibutuhkan oleh tabel UI
      select: {
        id: true,
        mataKuliah: true,
        dosen: true,
        ruangan: true,
        waktu: true,
        status: true,
      },
    });
    return data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    return [];
  }
}

export type JadwalData = Awaited<ReturnType<typeof getJadwal>>[0];

// 2. Fungsi Tambah Data
export async function addJadwal(data: {
  mataKuliah: string;
  dosen: string;
  ruangan: string;
  waktu: string;
  status: string;
}) {
  try {
    const newJadwal = await prisma.jadwal.create({
      data: {
        mataKuliah: data.mataKuliah,
        dosen: data.dosen,
        ruangan: data.ruangan,
        waktu: data.waktu,
        status: data.status,
      },
    });
    return { success: true, data: newJadwal };
  } catch (error) {
    console.error("Gagal menambah data:", error);
    return { success: false };
  }
}

// 3. Fungsi Hapus Data
export async function deleteJadwal(id: number) {
  try {
    await prisma.jadwal.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    return { success: false };
  }
}
