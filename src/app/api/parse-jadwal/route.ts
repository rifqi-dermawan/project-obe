import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as XLSX from "xlsx";

// Inisiasi AI dengan kunci dari .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    const fileName = file.name.toLowerCase();
    let fileContent = "";
    let usePdf = false;
    let pdfData = "";

    // 1. Ekstrak data berdasarkan tipe file
    if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
      usePdf = true;
      const pdfBuffer = Buffer.from(await file.arrayBuffer());
      pdfData = pdfBuffer.toString("base64");
    } else if (
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls") ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      
      // Menggabungkan seluruh sheets ke dalam text
      let excelText = "";
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        // Convert ke JSON array-of-arrays untuk presisi data grid
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        excelText += `Sheet: ${sheetName}\n${JSON.stringify(sheetData, null, 2)}\n\n`;
      });
      fileContent = excelText;
    } else {
      // Default untuk JSON, CSV, TXT
      fileContent = await file.text();
    }

    // 2. Siapkan Model AI (menggunakan versi flash untuk kecepatan maksimal)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // 3. Prompt Engineering
    const prompt = `
      Anda adalah sistem ekstraksi data jadwal perkuliahan otomatis.
      Tugas Anda adalah membaca data berikut (bisa berupa teks, data spreadsheet, atau dokumen PDF) dan mengubahnya menjadi array of objects JSON.
      
      Aturan ketat:
      1. Kembalikan HANYA array JSON, tanpa awalan atau akhiran teks apapun.
      2. Struktur objek harus persis seperti ini:
         {
           "subject": "string",
           "class": "string",
           "lecturer": "string",
           "room": "string",
           "day": "string",
           "startTime": "HH:MM",
           "endTime": "HH:MM"
         }
      3. Jika hari atau jam tidak eksplisit, coba deduksi dari konteks teks di sekitarnya.
      4. Format jam wajib "HH:MM" (contoh: 08:00, 13:30).
      5. Cari kolom kelas (seperti 4A, 4E, Karyawan, Ekstensi). Jika informasi kelas tidak tertera secara terpisah, tetapi tertulis di nama mata kuliah (misalnya "Struktur Data (4A)"), pisahkan namanya: subject menjadi "Struktur Data" dan class menjadi "4A". Jika tidak ada informasi kelas sama sekali, isi "-".
    `;

    // 4. Jalankan AI
    let result;
    if (usePdf) {
      const pdfPart = {
        inlineData: {
          data: pdfData,
          mimeType: "application/pdf",
        },
      };
      result = await model.generateContent([pdfPart, prompt]);
    } else {
      const promptWithContent = `
        ${prompt}

        Data Jadwal Mentah:
        """
        ${fileContent}
        """
      `;
      result = await model.generateContent(promptWithContent);
    }

    const responseText = result.response.text();

    // 5. Parse hasil JSON dari AI
    const parsedData = JSON.parse(responseText);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error("Kesalahan AI Engine:", error);
    return NextResponse.json(
      {
        error:
          "Gagal mengekstrak jadwal menggunakan AI. Pastikan file valid dan API Key sudah terpasang.",
      },
      { status: 500 },
    );
  }
}
