import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recalculateJadwalStatus } from "@/app/actions/jadwalActions";

// Endpoint GET Publik untuk diakses oleh Public App (Mahasiswa via QR Code)
export async function GET(request: Request) {
  try {
    // Tangkap parameter 'ruangan' dari URL (Contoh: ?ruangan=Lab Komputer 1)
    const { searchParams } = new URL(request.url);
    const ruanganQuery = searchParams.get("ruangan");

    // Hitung ulang status bentrok & potensi bentrok berdasarkan preferensi lab dosen
    await recalculateJadwalStatus();

    // Jika ada parameter ruangan, filter datanya. Jika tidak ada, kembalikan semua.
    const whereClause = ruanganQuery ? { ruangan: ruanganQuery } : {};

    // Ambil data langsung dari Supabase
    const jadwalList = await prisma.jadwal.findMany({
      where: whereClause,
      select: {
        id: true,
        mataKuliah: true,
        kelas: true,
        dosen: true,
        ruangan: true,
        waktu: true,
        status: true,
      },
      orderBy: {
        waktu: "asc", // Urutkan berdasarkan waktu agar rapi saat dibaca mahasiswa
      },
    });

    // Kembalikan respons dalam format JSON standar industri
    return NextResponse.json(
      {
        success: true,
        message: ruanganQuery ? `Menampilkan jadwal untuk ${ruanganQuery}` : "Menampilkan seluruh jadwal",
        total: jadwalList.length,
        data: jadwalList,
      },
      {
        status: 200,
        headers: {
          // CORS (Cross-Origin Resource Sharing) sangat penting untuk microservices
          // Ini mengizinkan aplikasi publik dari domain/port berbeda untuk menyedot data ini
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Gagal merender API:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal pada server penyedia API." },
      { status: 500 }
    );
  }
}