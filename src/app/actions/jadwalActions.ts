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

// Fungsi untuk menghitung ulang status jadwal (Aman, Bentrok, atau Potensi Bentrok) secara dinamis
export async function recalculateJadwalStatus() {
  try {
    const jadwals = await prisma.jadwal.findMany();
    const dosens = await prisma.dosen.findMany();
    const ruangans = await prisma.ruangan.findMany();

    const cleanName = (name: string) => {
      return name
        .toLowerCase()
        .replace(/^(dr\.|drs\.|ir\.|prof\.|ibu|bapak|h\.|hj\.)/g, "")
        .replace(/(,\s*(s\.t\.|m\.t\.|m\.pd\.|s\.pd\.|m\.si\.|s\.si|m\.m\.|s\.e\.|ak\.|ca\.|m\.h\.|s\.h\.|s\.pn|m\.kom|s\.kom|ph\.d|m\.sc|b\.eng|m\.eng))/gi, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
    };

    const isLabRoom = (roomName: string) => {
      const match = ruangans.find((r) => r.nama.toLowerCase() === roomName.toLowerCase());
      if (match) return match.tipe === "LAB";
      return roomName.toLowerCase().includes("lab");
    };

    // Helper untuk mendeteksi kelas ekstensi/karyawan (berlabel E atau bertuliskan Ekstensi/Karyawan)
    const isKelasEkstensi = (kelasName: string) => {
      const name = (kelasName || "").toLowerCase();
      return (
        name.includes("ekstensi") ||
        name.includes("karyawan") ||
        /\b\d*e\b/i.test(kelasName) ||
        /\be\b/i.test(kelasName)
      );
    };

    // Map preferensi lab dosen
    const dosenMintaLabMap = new Map(dosens.map((d) => [cleanName(d.nama), d.mintaLab]));

    for (const j1 of jadwals) {
      let status = "Aman";

      // Jika kelas j1 adalah kelas Ekstensi / Karyawan (Zoom Meet / Hybrid), maka tidak berkonflik fisik
      if (isKelasEkstensi(j1.kelas)) {
        status = "Aman";
      } else {
        for (const j2 of jadwals) {
          if (j1.id === j2.id) continue;

          // Jika j2 adalah kelas Ekstensi / Karyawan, maka j2 bisa online, abaikan dari bentrok fisik dengan j1
          if (isKelasEkstensi(j2.kelas)) continue;

          if (j1.waktu === j2.waktu) {
            // 1. Bentrok Nyata (Ruangan & Waktu sama)
            if (j1.ruangan.toLowerCase() === j2.ruangan.toLowerCase()) {
              status = "Bentrok";
              break; // Bentrok nyata adalah prioritas utama
            }

            // 2. Potensi Bentrok (Salah satu dosen minta Lab, terjadwal di Kelas, dan ada jadwal lain di Lab pada jam yang sama)
            const j1IsLab = isLabRoom(j1.ruangan);
            const j2IsLab = isLabRoom(j2.ruangan);
            const j1DosenMintaLab = dosenMintaLabMap.get(cleanName(j1.dosen)) || false;
            const j2DosenMintaLab = dosenMintaLabMap.get(cleanName(j2.dosen)) || false;

            if (j1DosenMintaLab && !j1IsLab && j2IsLab) {
              status = "Potensi Bentrok";
            } else if (j2DosenMintaLab && !j2IsLab && j1IsLab) {
              status = "Potensi Bentrok";
            }
          }
        }
      }

      if (j1.status !== status) {
        await prisma.jadwal.update({
          where: { id: j1.id },
          data: { status },
        });
      }
    }
  } catch (error) {
    console.error("Gagal menghitung ulang status jadwal:", error);
  }
}

// 1. Ambil Data
export async function getJadwal() {
  // Jalankan sinkronisasi secara self-healing agar data yang sudah masuk sebelumnya ikut tersinkron
  await syncDosenDanRuangan();
  // Hitung ulang status jadwal untuk mengakomodasi preferensi "mintaLab" dari dosen
  await recalculateJadwalStatus();

  const data = await prisma.jadwal.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      mataKuliah: true,
      kelas: true,
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
  kelas: string;
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
        kelas: data.kelas,
        dosen: data.dosen,
        ruangan: data.ruangan,
        waktu: data.waktu,
        status: data.status,
      },
    });

    // Hitung ulang status jadwal secara keseluruhan setelah penambahan
    await recalculateJadwalStatus();

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
    
    // Hitung ulang status jadwal secara keseluruhan setelah penghapusan
    await recalculateJadwalStatus();

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
    kelas: string;
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
        kelas: data.kelas,
        dosen: data.dosen,
        ruangan: data.ruangan,
        waktu: data.waktu,
        status: data.status,
      },
    });

    // Hitung ulang status jadwal secara keseluruhan setelah pembaruan
    await recalculateJadwalStatus();

    return { success: true, data: updated };
  } catch (error) {
    console.error("Gagal memperbarui data:", error);
    return { success: false };
  }
}
