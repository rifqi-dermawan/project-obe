"use server";

import prisma from "@/lib/prisma";

// Helper function to automatically sync lecturer and room data from schedules to their respective tables
async function syncDosenDanRuangan() {
  try {
    // Fetch all schedules
    const schedules = await prisma.schedule.findMany({
      select: {
        lecturer: true,
        room: true,
      },
    });

    // Extract unique non-empty lecturer & room names
    const uniqueLecturerNames = Array.from(new Set(schedules.map((s) => s.lecturer.trim()).filter(Boolean)));
    const uniqueRoomNames = Array.from(new Set(schedules.map((s) => s.room.trim()).filter(Boolean)));

    // Synchronize Lecturers
    for (const lecturerName of uniqueLecturerNames) {
      const existing = await prisma.lecturer.findFirst({
        where: { name: { equals: lecturerName, mode: "insensitive" } },
      });
      if (!existing) {
        await prisma.lecturer.create({
          data: {
            name: lecturerName,
            nip: "-",
            expertise: "-",
            contact: "-",
          },
        });
      }
    }

    // Synchronize Rooms
    for (const roomName of uniqueRoomNames) {
      const existing = await prisma.room.findFirst({
        where: { name: { equals: roomName, mode: "insensitive" } },
      });
      if (!existing) {
        const isLab = roomName.toLowerCase().includes("lab");
        const roomType = isLab ? "LAB" : "KELAS";
        await prisma.room.create({
          data: {
            name: roomName,
            type: roomType,
            capacity: 30,
            facilities: isLab ? "Komputer, Proyektor, AC, LAN" : "Papan Tulis, Proyektor, AC",
            status: "Tersedia",
          },
        });
      }
    }
  } catch (error) {
    console.error("Gagal sinkronisasi otomatis Dosen/Ruangan:", error);
  }
}

// Function to recalculate schedule conflicts (Aman, Bentrok, or Potensi Bentrok) dynamically
export async function recalculateJadwalStatus() {
  try {
    const schedules = await prisma.schedule.findMany();
    const lecturers = await prisma.lecturer.findMany();
    const rooms = await prisma.room.findMany();

    const cleanName = (name: string) => {
      return name
        .toLowerCase()
        .replace(/^(dr\.|drs\.|ir\.|prof\.|ibu|bapak|h\.|hj\.)/g, "")
        .replace(/(,\s*(s\.t\.|m\.t\.|m\.pd\.|s\.pd\.|m\.si\.|s\.si|m\.m\.|s\.e\.|ak\.|ca\.|m\.h\.|s\.h\.|s\.pn|m\.kom|s\.kom|ph\.d|m\.sc|b\.eng|m\.eng))/gi, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
    };

    const isLabRoom = (roomName: string) => {
      const match = rooms.find((r) => r.name.toLowerCase() === roomName.toLowerCase());
      if (match) return match.type === "LAB";
      return roomName.toLowerCase().includes("lab");
    };

    // Helper to detect extension/night classes
    const isKelasEkstensi = (className: string) => {
      const name = (className || "").toLowerCase();
      return (
        name.includes("ekstensi") ||
        name.includes("karyawan") ||
        /\b\d*e\b/i.test(className) ||
        /\be\b/i.test(className)
      );
    };

    // Map lecturer lab request preferences
    const lecturerRequestLabMap = new Map(lecturers.map((l) => [cleanName(l.name), l.requestLab]));

    for (const s1 of schedules) {
      let status = "Aman";

      if (isKelasEkstensi(s1.class)) {
        status = "Aman";
      } else {
        for (const s2 of schedules) {
          if (s1.id === s2.id) continue;

          if (isKelasEkstensi(s2.class)) continue;

          if (s1.time === s2.time) {
            // 1. Physical conflict (Same Room & Time)
            if (s1.room.toLowerCase() === s2.room.toLowerCase()) {
              status = "Bentrok";
              break;
            }

            // 2. Potential conflict (Lecturer requests Lab, scheduled in Class, while there is another schedule in Lab at the same time)
            const s1IsLab = isLabRoom(s1.room);
            const s2IsLab = isLabRoom(s2.room);
            const s1LecturerRequestLab = lecturerRequestLabMap.get(cleanName(s1.lecturer)) || false;
            const s2LecturerRequestLab = lecturerRequestLabMap.get(cleanName(s2.lecturer)) || false;

            if (s1LecturerRequestLab && !s1IsLab && s2IsLab) {
              status = "Potensi Bentrok";
            } else if (s2LecturerRequestLab && !s2IsLab && s1IsLab) {
              status = "Potensi Bentrok";
            }
          }
        }
      }

      if (s1.status !== status) {
        await prisma.schedule.update({
          where: { id: s1.id },
          data: { status },
        });
      }
    }
  } catch (error) {
    console.error("Gagal menghitung ulang status jadwal:", error);
  }
}

// 1. Get Schedules
export async function getJadwal() {
  await syncDosenDanRuangan();
  await recalculateJadwalStatus();

  const data = await prisma.schedule.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      subject: true,
      class: true,
      lecturer: true,
      room: true,
      time: true,
      status: true,
    },
  });
  return data;
}

export type JadwalData = Awaited<ReturnType<typeof getJadwal>>[0];

// 2. Add Schedule
export async function addJadwal(data: {
  subject: string;
  class: string;
  lecturer: string;
  room: string;
  time: string;
  status: string;
}) {
  try {
    // 1. Sync Lecturer
    if (data.lecturer.trim() !== "") {
      const existingLecturer = await prisma.lecturer.findFirst({
        where: { name: { equals: data.lecturer.trim(), mode: "insensitive" } },
      });
      if (!existingLecturer) {
        await prisma.lecturer.create({
          data: {
            name: data.lecturer.trim(),
            nip: "-",
            expertise: "-",
            contact: "-",
          },
        });
      }
    }

    // 2. Sync Room
    if (data.room.trim() !== "") {
      const existingRoom = await prisma.room.findFirst({
        where: { name: { equals: data.room.trim(), mode: "insensitive" } },
      });
      if (!existingRoom) {
        const isLab = data.room.toLowerCase().includes("lab");
        const roomType = isLab ? "LAB" : "KELAS";
        await prisma.room.create({
          data: {
            name: data.room.trim(),
            type: roomType,
            capacity: 30,
            facilities: isLab ? "Komputer, Proyektor, AC, LAN" : "Papan Tulis, Proyektor, AC",
            status: "Tersedia",
          },
        });
      }
    }

    const newSchedule = await prisma.schedule.create({
      data: {
        subject: data.subject,
        class: data.class,
        lecturer: data.lecturer,
        room: data.room,
        time: data.time,
        status: data.status,
      },
    });

    await recalculateJadwalStatus();

    return { success: true, data: newSchedule };
  } catch (error) {
    console.error("Gagal menambah data:", error);
    return { success: false };
  }
}

// 3. Delete Schedule
export async function deleteJadwal(id: number) {
  try {
    await prisma.schedule.delete({
      where: { id },
    });
    
    await recalculateJadwalStatus();

    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    return { success: false };
  }
}

// 4. Update Schedule
export async function updateJadwal(
  id: number,
  data: {
    subject: string;
    class: string;
    lecturer: string;
    room: string;
    time: string;
    status: string;
  },
) {
  try {
    // 1. Sync Lecturer
    if (data.lecturer.trim() !== "") {
      const existingLecturer = await prisma.lecturer.findFirst({
        where: { name: { equals: data.lecturer.trim(), mode: "insensitive" } },
      });
      if (!existingLecturer) {
        await prisma.lecturer.create({
          data: {
            name: data.lecturer.trim(),
            nip: "-",
            expertise: "-",
            contact: "-",
          },
        });
      }
    }

    // 2. Sync Room
    if (data.room.trim() !== "") {
      const existingRoom = await prisma.room.findFirst({
        where: { name: { equals: data.room.trim(), mode: "insensitive" } },
      });
      if (!existingRoom) {
        const isLab = data.room.toLowerCase().includes("lab");
        const roomType = isLab ? "LAB" : "KELAS";
        await prisma.room.create({
          data: {
            name: data.room.trim(),
            type: roomType,
            capacity: 30,
            facilities: isLab ? "Komputer, Proyektor, AC, LAN" : "Papan Tulis, Proyektor, AC",
            status: "Tersedia",
          },
        });
      }
    }

    const updated = await prisma.schedule.update({
      where: { id },
      data: {
        subject: data.subject,
        class: data.class,
        lecturer: data.lecturer,
        room: data.room,
        time: data.time,
        status: data.status,
      },
    });

    await recalculateJadwalStatus();

    return { success: true, data: updated };
  } catch (error) {
    console.error("Gagal memperbarui data:", error);
    return { success: false };
  }
}
