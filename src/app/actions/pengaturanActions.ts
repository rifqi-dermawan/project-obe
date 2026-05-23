"use server";

import prisma from "@/lib/prisma";

// 1. Fungsi Ambil Pengaturan (Karena hanya 1 baris, kita ambil ID 1)
export async function getPengaturan() {
  try {
    let pengaturan = await prisma.pengaturan.findUnique({
      where: { id: 1 },
    });

    // Jika belum ada, buat pengaturan default
    if (!pengaturan) {
      pengaturan = await prisma.pengaturan.create({
        data: {
          id: 1,
        },
      });
    }

    return pengaturan;
  } catch (error) {
    console.error("Gagal mengambil data pengaturan:", error);
    return null;
  }
}

export type PengaturanData = NonNullable<Awaited<ReturnType<typeof getPengaturan>>>;

// 2. Fungsi Update Pengaturan
export async function updatePengaturan(data: {
  namaInstitusi: string;
  tahunAkademik: string;
  semester: string;
  notifikasiEmail: boolean;
  temaAplikasi: string;
}) {
  try {
    const updatedPengaturan = await prisma.pengaturan.upsert({
      where: { id: 1 },
      update: {
        namaInstitusi: data.namaInstitusi,
        tahunAkademik: data.tahunAkademik,
        semester: data.semester,
        notifikasiEmail: data.notifikasiEmail,
        temaAplikasi: data.temaAplikasi,
      },
      create: {
        id: 1,
        namaInstitusi: data.namaInstitusi,
        tahunAkademik: data.tahunAkademik,
        semester: data.semester,
        notifikasiEmail: data.notifikasiEmail,
        temaAplikasi: data.temaAplikasi,
      },
    });
    return { success: true, data: updatedPengaturan };
  } catch (error) {
    console.error("Gagal menyimpan pengaturan:", error);
    return { success: false };
  }
}
