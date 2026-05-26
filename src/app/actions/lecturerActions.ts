"use server";

import prisma from "@/lib/prisma";
import { recalculateJadwalStatus } from "./scheduleActions";

// 1. Get all lecturers
export async function getLecturers() {
  try {
    const data = await prisma.lecturer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return data;
  } catch (error) {
    console.error("Gagal mengambil data dosen:", error);
    return [];
  }
}

export type LecturerData = Awaited<ReturnType<typeof getLecturers>>[0];

// 2. Add Lecturer
export async function addLecturer(data: {
  name: string;
  nip: string;
  expertise: string;
  contact: string;
  requestLab?: boolean;
}) {
  try {
    const newLecturer = await prisma.lecturer.create({
      data: {
        name: data.name,
        nip: data.nip,
        expertise: data.expertise,
        contact: data.contact,
        requestLab: data.requestLab ?? false,
      },
    });
    return { success: true, data: newLecturer };
  } catch (error) {
    console.error("Gagal menambah data dosen:", error);
    return { success: false };
  }
}

// 3. Delete Lecturer
export async function deleteLecturer(id: number) {
  try {
    await prisma.lecturer.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus data dosen:", error);
    return { success: false };
  }
}

// 4. Toggle Lecturer Request Lab
export async function toggleLecturerRequestLab(id: number, requestLab: boolean) {
  try {
    const updated = await prisma.lecturer.update({
      where: { id },
      data: { requestLab },
    });

    // Recalculate schedules conflict status
    await recalculateJadwalStatus();

    return { success: true, data: updated };
  } catch (error) {
    console.error("Gagal mengubah preferensi lab dosen:", error);
    return { success: false };
  }
}

// Helper to decrypt Cloudflare obfuscated email
function decryptCfEmail(encodedString: string): string {
  let email = "";
  const r = parseInt(encodedString.substring(0, 2), 16);
  for (let n = 2; n < encodedString.length; n += 2) {
    const i = parseInt(encodedString.substring(n, n + 2), 16) ^ r;
    email += String.fromCharCode(i);
  }
  return email;
}

// Batch fetching with limit concurrency
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

          // Extract email
          let email = "-";
          const emailMatch = html.match(/data-cfemail="([^"]+)"/i);
          if (emailMatch) {
            email = decryptCfEmail(emailMatch[1]);
          }

          // Extract Expertise
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

// 5. Sync Lecturers from E-Staff
export async function syncLecturerWithEStaff() {
  try {
    const allLecturers: { name: string; url: string; faculty: string; nip: string; role: string }[] = [];

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

        const cells: string[] = [];
        const cellMatches = rowHtml.matchAll(/<td>([\s\S]*?)<\/td>/gi);
        for (const cellMatch of cellMatches) {
          cells.push(cellMatch[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim());
        }

        if (cells.length >= 5) {
          parsed.push({
            name: rawName,
            url: detailUrl,
            faculty: cells[2],
            nip: cells[3],
            role: cells[4],
          });
        }
      }

      if (parsed.length === 0) break;
      allLecturers.push(...parsed);
    }

    if (allLecturers.length === 0) {
      return { success: false, message: "Tidak ada data dosen yang dapat ditarik dari E-Staff.", unmatchedNames: [] };
    }

    const existingLecturers = await prisma.lecturer.findMany();

    const detailedLecturers = await fetchDetailPages(allLecturers);

    let updatedCount = 0;
    let createdCount = 0;

    const cleanName = (name: string) => {
      return name
        .toLowerCase()
        .replace(/^(dr\.|drs\.|ir\.|prof\.|ibu|bapak|h\.|hj\.)/g, "")
        .replace(/(,\s*(s\.t\.|m\.t\.|m\.pd\.|s\.pd\.|m\.si\.|s\.si|m\.m\.|s\.e\.|ak\.|ca\.|m\.h\.|s\.h\.|s\.pn|m\.kom|s\.kom|ph\.d|m\.sc|b\.eng|m\.eng))/gi, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
    };

    for (const staff of detailedLecturers) {
      const cleanStaffName = cleanName(staff.name);

      const match = existingLecturers.find((d) => cleanName(d.name) === cleanStaffName);

      if (match) {
        const oldName = match.name;

        await prisma.lecturer.update({
          where: { id: match.id },
          data: {
            name: staff.name,
            nip: staff.nip,
            expertise: staff.keahlian,
            contact: staff.email,
          },
        });

        // Update schedule lecturer names if they changed (e.g. degrees added)
        if (oldName !== staff.name) {
          await prisma.schedule.updateMany({
            where: { lecturer: oldName },
            data: { lecturer: staff.name },
          });
        }

        updatedCount++;
      } else {
        await prisma.lecturer.create({
          data: {
            name: staff.name,
            nip: staff.nip,
            expertise: staff.keahlian,
            contact: staff.email,
          },
        });
        createdCount++;
      }
    }

    const unmatchedLecturers = existingLecturers.filter(
      (d) => !allLecturers.some((staff) => cleanName(staff.name) === cleanName(d.name))
    );

    const unmatchedNames = unmatchedLecturers.map((d) => d.name);

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
