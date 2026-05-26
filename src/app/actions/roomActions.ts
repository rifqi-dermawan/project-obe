"use server";

import prisma from "@/lib/prisma";

// 1. Get all rooms
export async function getRooms() {
  try {
    const data = await prisma.room.findMany({
      orderBy: { createdAt: "desc" },
    });
    return data;
  } catch (error) {
    console.error("Gagal mengambil data ruangan:", error);
    return [];
  }
}

export type RoomData = Awaited<ReturnType<typeof getRooms>>[0];

// 2. Add Room
export async function addRoom(data: {
  name: string;
  capacity: number;
  facilities: string;
  status: string;
}) {
  try {
    const isLab = data.name.toLowerCase().includes("lab");
    const roomType = isLab ? "LAB" : "KELAS";

    const newRoom = await prisma.room.create({
      data: {
        name: data.name,
        type: roomType,
        capacity: data.capacity,
        facilities: data.facilities,
        status: data.status,
      },
    });
    return { success: true, data: newRoom };
  } catch (error) {
    console.error("Gagal menambah data ruangan:", error);
    return { success: false };
  }
}

// 3. Delete Room
export async function deleteRoom(id: number) {
  try {
    await prisma.room.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus data ruangan:", error);
    return { success: false };
  }
}
