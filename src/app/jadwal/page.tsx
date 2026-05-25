"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  User,
  Loader2,
  QrCode,
} from "lucide-react";

// Tipe data sesuai balasan dari API
type JadwalPublic = {
  id: number;
  mataKuliah: string;
  dosen: string;
  ruangan: string;
  waktu: string;
  status: string;
};

// Komponen Utama yang dibungkus Suspense (Syarat Next.js untuk useSearchParams)
function PublicScheduleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil parameter ?ruangan= dari URL (jika ada)
  const initialRuangan = searchParams.get("ruangan") || "";

  const [jadwal, setJadwal] = useState<JadwalPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRuangan, setSelectedRuangan] = useState(initialRuangan);

  // Daftar statis ruangan untuk dropdown (Nantinya bisa di-fetch dari API Ruangan juga)
  const daftarRuangan = [
    "Lab Komputer 1",
    "Lab Komputer 2",
    "Lab Jaringan",
    "Kelas A.1",
    "Kelas A.2",
    "Semua Ruangan",
  ];

  const fetchJadwal = async (ruangan: string) => {
    setIsLoading(true);
    try {
      // Panggil API Microservices kita
      const query =
        ruangan && ruangan !== "Semua Ruangan"
          ? `?ruangan=${encodeURIComponent(ruangan)}`
          : "";
      const response = await fetch(`/api/v1/jadwal${query}`);
      const result = await response.json();

      if (result.success) {
        setJadwal(result.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data jadwal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal(selectedRuangan);
  }, [selectedRuangan]);

  const handleRuanganChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedRuangan(val);

    // Update URL agar rapi dan bisa di-share/dijadikan QR Code
    if (val === "Semua Ruangan" || val === "") {
      router.push("/jadwal");
    } else {
      router.push(`/jadwal?ruangan=${encodeURIComponent(val)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-12">
      {/* HEADER MOBILE-FIRST */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-white/10 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Portal Jadwal
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                Informatika Universitas Pancasakti
              </p>
            </div>
          </div>

          {/* DROPDOWN POPOVER FILTER */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="h-5 w-5 text-indigo-500" />
            </div>
            <select
              value={selectedRuangan || "Semua Ruangan"}
              onChange={handleRuanganChange}
              className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all dark:text-white"
            >
              <option value="Semua Ruangan" className="font-semibold">
                Menampilkan Semua Ruangan
              </option>
              <optgroup label="Pilih Ruangan:">
                {daftarRuangan
                  .filter((r) => r !== "Semua Ruangan")
                  .map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="max-w-md mx-auto px-4 mt-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
            <p className="text-sm font-medium">Memuat jadwal terbaru...</p>
          </div>
        ) : jadwal.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800"
          >
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-zinc-600" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
              Kosong
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Tidak ada jadwal perkuliahan untuk ruangan ini.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {jadwal.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={item.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-white/5 relative overflow-hidden"
              >
                {/* Indikator Warna Status */}
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full ${item.status === "Aman" ? "bg-green-500" : "bg-red-500"}`}
                />

                <div className="pl-2">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                      {item.mataKuliah}
                    </h2>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        item.status === "Aman"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center text-sm text-slate-600 dark:text-zinc-300">
                      <User className="w-4 h-4 mr-2.5 text-slate-400" />
                      <span className="font-medium">{item.dosen}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-zinc-300">
                      <Clock className="w-4 h-4 mr-2.5 text-slate-400" />
                      <span>{item.waktu}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-zinc-300">
                      <MapPin className="w-4 h-4 mr-2.5 text-slate-400" />
                      <span>{item.ruangan}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicSchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <PublicScheduleContent />
    </Suspense>
  );
}
