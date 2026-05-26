"use server";

import prisma from "@/lib/prisma";

// 1. Get Settings (Since it is only 1 row, we fetch ID 1)
export async function getSettings() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 1 },
    });

    // If not exists, create default settings
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 1,
        },
      });
    }

    return settings;
  } catch (error) {
    console.error("Gagal mengambil data pengaturan:", error);
    return null;
  }
}

export type SettingsData = NonNullable<Awaited<ReturnType<typeof getSettings>>>;

// 2. Update Settings
export async function updateSettings(data: {
  institutionName: string;
  academicYear: string;
  semester: string;
  emailNotification: boolean;
  appTheme: string;
}) {
  try {
    const updatedSettings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        institutionName: data.institutionName,
        academicYear: data.academicYear,
        semester: data.semester,
        emailNotification: data.emailNotification,
        appTheme: data.appTheme,
      },
      create: {
        id: 1,
        institutionName: data.institutionName,
        academicYear: data.academicYear,
        semester: data.semester,
        emailNotification: data.emailNotification,
        appTheme: data.appTheme,
      },
    });
    return { success: true, data: updatedSettings };
  } catch (error) {
    console.error("Gagal menyimpan pengaturan:", error);
    return { success: false };
  }
}
