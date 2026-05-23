"use server";

import prisma from "@/lib/prisma";

// 1. Fungsi Ambil Semua Data Dosen
export async function getDosen() {
  try {
    const data = await prisma.dosen.findMany({
      orderBy: { createdAt: "desc" },
    });
    return data;
  } catch (error) {
    console.error("Gagal mengambil data dosen:", error);
    return [];
  }
}

export type DosenData = Awaited<ReturnType<typeof getDosen>>[0];

// 2. Fungsi Tambah Data Dosen
export async function addDosen(data: {
  nama: string;
  nip: string;
  keahlian: string;
  kontak: string;
}) {
  try {
    const newDosen = await prisma.dosen.create({
      data: {
        nama: data.nama,
        nip: data.nip,
        keahlian: data.keahlian,
        kontak: data.kontak,
      },
    });
    return { success: true, data: newDosen };
  } catch (error) {
    console.error("Gagal menambah data dosen:", error);
    return { success: false };
  }
}

// 3. Fungsi Hapus Data Dosen
export async function deleteDosen(id: number) {
  try {
    await prisma.dosen.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus data dosen:", error);
    return { success: false };
  }
}
