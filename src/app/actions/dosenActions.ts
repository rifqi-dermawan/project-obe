"use server";

import prisma from "@/lib/prisma";
import { recalculateJadwalStatus } from "./jadwalActions";

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
  mintaLab?: boolean;
}) {
  try {
    const newDosen = await prisma.dosen.create({
      data: {
        nama: data.nama,
        nip: data.nip,
        keahlian: data.keahlian,
        kontak: data.kontak,
        mintaLab: data.mintaLab ?? false,
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

// 3.5. Fungsi Toggle Minta Lab Dosen
export async function toggleDosenMintaLab(id: number, mintaLab: boolean) {
  try {
    const updated = await prisma.dosen.update({
      where: { id },
      data: { mintaLab },
    });

    // Hitung ulang status bentrok/potensi bentrok seluruh jadwal berdasarkan preferensi lab yang baru di-toggle
    await recalculateJadwalStatus();

    return { success: true, data: updated };
  } catch (error) {
    console.error("Gagal mengubah preferensi lab dosen:", error);
    return { success: false };
  }
}

// Helper untuk mendekripsi email yang disamarkan oleh Cloudflare
function decryptCfEmail(encodedString: string): string {
  let email = "";
  const r = parseInt(encodedString.substring(0, 2), 16);
  for (let n = 2; n < encodedString.length; n += 2) {
    const i = parseInt(encodedString.substring(n, 2), 16) ^ r;
    email += String.fromCharCode(i);
  }
  return email;
}

// Batch fetching dengan limit concurrency
async function fetchDetailPages(
  lecturers: { name: string; url: string; faculty: string; nip: string; role: string }[]
) {
  const limit = 15;
  const results = [];
  for (let i = 0; i < lecturers.length; i += limit) {
    const batch = lecturers.slice(i, i + limit);
    const batchResults = await Promise.all(
      batch.map(async (lecturer) => {
        try {
          const res = await fetch(lecturer.url);
          if (!res.ok) {
            return { ...lecturer, email: "-", keahlian: `Dosen ${lecturer.faculty}` };
          }
          const html = await res.text();

          // Ekstrak email (Cloudflare obfuscated)
          let email = "-";
          const emailMatch = html.match(/data-cfemail="([^"]+)"/i);
          if (emailMatch) {
            email = decryptCfEmail(emailMatch[1]);
          }

          // Ekstrak Keahlian
          let keahlian = `Dosen ${lecturer.faculty}`;
          const keahlianMatch = html.match(/<td>Keahlian<\/td>\s*<td>:<\/td>\s*<td>([\s\S]*?)<\/td>/i);
          if (keahlianMatch) {
            keahlian = keahlianMatch[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
          }

          return { ...lecturer, email, keahlian };
        } catch (error) {
          return { ...lecturer, email: "-", keahlian: `Dosen ${lecturer.faculty}` };
        }
      })
    );
    results.push(...batchResults);
  }
  return results;
}

// 4. Fungsi Sinkronisasi Dosen dari E-Staff UPS Tegal
export async function syncDosenWithEStaff() {
  try {
    const allLecturers: { name: string; url: string; faculty: string; nip: string; role: string }[] = [];

    // Mengambil data dari halaman 1 sampai 15 (atau sampai halaman kosong)
    for (let page = 1; page <= 15; page++) {
      const res = await fetch(`https://estaff.upstegal.ac.id/tenaga-pendidik?page=${page}`, {
        cache: "no-store",
      });
      if (!res.ok) break;
      const html = await res.text();

      const parsed: { name: string; url: string; faculty: string; nip: string; role: string }[] = [];
      const matches = html.matchAll(/<tr>[\s\S]*?<\/tr>/gi);
      for (const match of matches) {
        const rowHtml = match[0];
        if (rowHtml.includes("<thead>") || rowHtml.includes("<th>")) continue;

        const nameMatch = rowHtml.match(/<a[^>]*href="([^"]*\/tenaga-pendidik\/(\d+))"[^>]*>([\s\S]*?)<\/a>/i);
        if (!nameMatch) continue;

        const detailUrl = nameMatch[1].startsWith("http")
          ? nameMatch[1]
          : `https://estaff.upstegal.ac.id${nameMatch[1]}`;

        const rawName = nameMatch[3].replace(/\s+/g, " ").trim();

        // Ekstrak sel data
        const cells: string[] = [];
        const cellMatches = rowHtml.matchAll(/<td>([\s\S]*?)<\/td>/gi);
        for (const cellMatch of cellMatches) {
          cells.push(cellMatch[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim());
        }

        if (cells.length >= 5) {
          parsed.push({
            name: rawName,
            url: detailUrl,
            faculty: cells[2], // Unit Kerja (misal: FTIK, FEB, dll)
            nip: cells[3],     // NIP / NIPY
            role: cells[4],    // Status
          });
        }
      }

      if (parsed.length === 0) break;
      allLecturers.push(...parsed);
    }

    if (allLecturers.length === 0) {
      return { success: false, message: "Tidak ada data dosen yang dapat ditarik dari E-Staff.", unmatchedNames: [] };
    }

    // Ambil data dosen yang ada di DB saat ini
    const existingDosen = await prisma.dosen.findMany();

    // Lakukan batch fetching untuk semua halaman profil detail dosen untuk mendapatkan email & keahlian
    const detailedLecturers = await fetchDetailPages(allLecturers);

    let updatedCount = 0;
    let createdCount = 0;

    // Helper untuk membersihkan gelar dan karakter aneh agar pencocokan nama akurat
    const cleanName = (name: string) => {
      return name
        .toLowerCase()
        .replace(/^(dr\.|drs\.|ir\.|prof\.|ibu|bapak|h\.|hj\.)/g, "")
        .replace(/(,\s*(s\.t\.|m\.t\.|m\.pd\.|s\.pd\.|m\.si\.|s\.si|m\.m\.|s\.e\.|ak\.|ca\.|m\.h\.|s\.h\.|s\.pn|m\.kom|s\.kom|ph\.d|m\.sc|b\.eng|m\.eng))/gi, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
    };

    // Proses sinkronisasi
    for (const staff of detailedLecturers) {
      const cleanStaffName = cleanName(staff.name);

      // Cari kecocokan di database
      const match = existingDosen.find((d) => cleanName(d.nama) === cleanStaffName);

      if (match) {
        // Simpan nama lama sebelum di-update untuk update tabel Jadwal
        const oldName = match.nama;

        // Jika cocok, update NIP, Nama Lengkap Resmi beserta gelar, Keahlian, dan Kontak (email)
        await prisma.dosen.update({
          where: { id: match.id },
          data: {
            nama: staff.name,
            nip: staff.nip,
            keahlian: staff.keahlian,
            kontak: staff.email,
          },
        });

        // Update juga nama dosen di semua Jadwal terkait jika namanya berbeda (gelarnya bertambah)
        if (oldName !== staff.name) {
          await prisma.jadwal.updateMany({
            where: { dosen: oldName },
            data: { dosen: staff.name },
          });
        }

        updatedCount++;
      } else {
        // Jika belum ada di DB, buat baru (mendukung FEB, FTIK, FKIP, FH, dll sesuai request)
        await prisma.dosen.create({
          data: {
            nama: staff.name,
            nip: staff.nip,
            keahlian: staff.keahlian,
            kontak: staff.email,
          },
        });
        createdCount++;
      }
    }

    // Cari dosen di database lokal yang TIDAK cocok dengan data E-Staff manapun (untuk diberitahukan agar disesuaikan manual)
    const unmatchedDosen = existingDosen.filter(
      (d) => !allLecturers.some((staff) => cleanName(staff.name) === cleanName(d.nama))
    );

    const unmatchedNames = unmatchedDosen.map((d) => d.nama);

    return {
      success: true,
      message: `Sinkronisasi selesai! ${updatedCount} dosen diperbarui, dan ${createdCount} dosen baru berhasil ditambahkan dari E-Staff.`,
      unmatchedNames,
    };
  } catch (error) {
    console.error("Gagal sinkronisasi dengan E-Staff:", error);
    return { success: false, message: "Gagal terhubung dengan server E-Staff UPS Tegal.", unmatchedNames: [] };
  }
}

