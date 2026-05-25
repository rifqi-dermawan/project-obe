"use server";

import prisma from "@/lib/prisma";

// Fungsi pembantu untuk mensinkronisasi data dosen dan ruangan yang ada di tabel jadwal ke tabel dosen & ruangan masing-masing
async function syncDosenDanRuangan() {
  try {
    // Ambil semua jadwal
    const jadwals = await prisma.jadwal.findMany({
      select: {
        dosen: true,
        ruangan: true,
      },
    });

    // Ambil semua nama dosen & ruangan unik yang tidak kosong
    const uniqueDosenNames = Array.from(new Set(jadwals.map((j) => j.dosen.trim()).filter(Boolean)));
    const uniqueRuanganNames = Array.from(new Set(jadwals.map((j) => j.ruangan.trim()).filter(Boolean)));

    // Sinkronisasi Dosen
    for (const namaDosen of uniqueDosenNames) {
      const existing = await prisma.dosen.findFirst({
        where: { nama: { equals: namaDosen, mode: "insensitive" } },
      });
      if (!existing) {
        await prisma.dosen.create({
          data: {
            nama: namaDosen,
            nip: "-",
            keahlian: "-",
            kontak: "-",
          },
        });
      }
    }

    // Sinkronisasi Ruangan
    for (const namaRuangan of uniqueRuanganNames) {
      const existing = await prisma.ruangan.findFirst({
        where: { nama: { equals: namaRuangan, mode: "insensitive" } },
      });
      if (!existing) {
        const isLab = namaRuangan.toLowerCase().includes("lab");
        const tipeRuangan = isLab ? "LAB" : "KELAS";
        await prisma.ruangan.create({
          data: {
            nama: namaRuangan,
            tipe: tipeRuangan,
            kapasitas: 30,
            fasilitas: isLab ? "Komputer, Proyektor, AC, LAN" : "Papan Tulis, Proyektor, AC",
            status: "Tersedia",
          },
        });
      }
    }
  } catch (error) {
    console.error("Gagal sinkronisasi otomatis Dosen/Ruangan:", error);
  }
}

// 1. Ambil Data
export async function getJadwal() {
  // Jalankan sinkronisasi secara self-healing agar data yang sudah masuk sebelumnya ikut tersinkron
  await syncDosenDanRuangan();

  const data = await prisma.jadwal.findMany({
    orderBy: { createdAt: "desc" },
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
}

export type JadwalData = Awaited<ReturnType<typeof getJadwal>>[0];

// 2. Tambah Data
export async function addJadwal(data: {
  mataKuliah: string;
  dosen: string;
  ruangan: string;
  waktu: string;
  status: string;
}) {
  try {
    // 1. Sinkronisasi Dosen
    if (data.dosen.trim() !== "") {
      const existingDosen = await prisma.dosen.findFirst({
        where: { nama: { equals: data.dosen.trim(), mode: "insensitive" } },
      });
      if (!existingDosen) {
        await prisma.dosen.create({
          data: {
            nama: data.dosen.trim(),
            nip: "-",
            keahlian: "-",
            kontak: "-",
          },
        });
      }
    }

    // 2. Sinkronisasi Ruangan
    if (data.ruangan.trim() !== "") {
      const existingRuangan = await prisma.ruangan.findFirst({
        where: { nama: { equals: data.ruangan.trim(), mode: "insensitive" } },
      });
      if (!existingRuangan) {
        const isLab = data.ruangan.toLowerCase().includes("lab");
        const tipeRuangan = isLab ? "LAB" : "KELAS";
        await prisma.ruangan.create({
          data: {
            nama: data.ruangan.trim(),
            tipe: tipeRuangan,
            kapasitas: 30,
            fasilitas: isLab ? "Komputer, Proyektor, AC, LAN" : "Papan Tulis, Proyektor, AC",
            status: "Tersedia",
          },
        });
      }
    }

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

// 3. Hapus Data
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

// 4. Update Data (Edit)
export async function updateJadwal(
  id: number,
  data: {
    mataKuliah: string;
    dosen: string;
    ruangan: string;
    waktu: string;
    status: string;
  },
) {
  try {
    // 1. Sinkronisasi Dosen
    if (data.dosen.trim() !== "") {
      const existingDosen = await prisma.dosen.findFirst({
        where: { nama: { equals: data.dosen.trim(), mode: "insensitive" } },
      });
      if (!existingDosen) {
        await prisma.dosen.create({
          data: {
            nama: data.dosen.trim(),
            nip: "-",
            keahlian: "-",
            kontak: "-",
          },
        });
      }
    }

    // 2. Sinkronisasi Ruangan
    if (data.ruangan.trim() !== "") {
      const existingRuangan = await prisma.ruangan.findFirst({
        where: { nama: { equals: data.ruangan.trim(), mode: "insensitive" } },
      });
      if (!existingRuangan) {
        const isLab = data.ruangan.toLowerCase().includes("lab");
        const tipeRuangan = isLab ? "LAB" : "KELAS";
        await prisma.ruangan.create({
          data: {
            nama: data.ruangan.trim(),
            tipe: tipeRuangan,
            kapasitas: 30,
            fasilitas: isLab ? "Komputer, Proyektor, AC, LAN" : "Papan Tulis, Proyektor, AC",
            status: "Tersedia",
          },
        });
      }
    }

    const updated = await prisma.jadwal.update({
      where: { id },
      data: {
        mataKuliah: data.mataKuliah,
        dosen: data.dosen,
        ruangan: data.ruangan,
        waktu: data.waktu,
        status: data.status,
      },
    });
    return { success: true, data: updated };
  } catch (error) {
    console.error("Gagal memperbarui data:", error);
    return { success: false };
  }
}
