"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Loader2,
  QrCode,
  Search,
} from "lucide-react";

import { getRuangan } from "@/app/actions/ruanganActions";

// Tipe data sesuai balasan dari API
type JadwalPublic = {
  id: number;
  mataKuliah: string;
  kelas: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [daftarRuangan, setDaftarRuangan] = useState<{ id: number; nama: string; tipe: string }[]>([]);

  useEffect(() => {
    const fetchRuangan = async () => {
      try {
        const res = await getRuangan();
        setDaftarRuangan(res);
      } catch (err) {
        console.error("Gagal mengambil daftar ruangan:", err);
      }
    };
    fetchRuangan();
  }, []);

  const fetchJadwal = async (ruangan: string) => {
    setIsLoading(true);
    try {
      // Panggil API Publik
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

  // Filter jadwal berdasarkan search query yang diketik mahasiswa
  const filteredJadwal = jadwal.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.mataKuliah.toLowerCase().includes(query) ||
      (item.kelas || "").toLowerCase().includes(query) ||
      item.dosen.toLowerCase().includes(query) ||
      item.ruangan.toLowerCase().includes(query) ||
      item.waktu.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-12">
      {/* HEADER - WIDE CONTAINER */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-white/10 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Portal Jadwal Informatika
                </h1>
                <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                  Universitas Pancasakti Tegal
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-400 dark:text-zinc-500 italic">
              Mahasiswa dapat mencari kelas, dosen, hari, atau ruangan secara realtime.
            </div>
          </div>

          {/* SEARCH BAR & DROPDOWN FILTER SIDE-BY-SIDE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                <optgroup label="Laboratorium:">
                  {daftarRuangan
                    .filter((r) => r.tipe === "LAB")
                    .map((r) => (
                      <option key={r.id} value={r.nama}>
                        {r.nama}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Ruangan Kelas:">
                  {daftarRuangan
                    .filter((r) => r.tipe === "KELAS")
                    .map((r) => (
                      <option key={r.id} value={r.nama}>
                        {r.nama}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-5 w-5 text-indigo-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari mata kuliah, dosen, hari, atau ruangan..."
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT TABLE - WIDE & UNIFORM */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
            <p className="text-sm font-medium">Memuat jadwal terbaru...</p>
          </div>
        ) : filteredJadwal.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-6 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 shadow-sm"
          >
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-zinc-600" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
              Jadwal Tidak Ditemukan
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Tidak ada jadwal perkuliahan yang cocok dengan pencarian Anda.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-950/50 text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider text-left border-b border-slate-200 dark:border-white/5">
                    <th className="py-4 px-6 w-[200px]">Waktu</th>
                    <th className="py-4 px-6">Mata Kuliah</th>
                    <th className="py-4 px-6">Kelas</th>
                    <th className="py-4 px-6">Dosen</th>
                    <th className="py-4 px-6">Ruangan</th>
                    <th className="py-4 px-6 text-center w-[150px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredJadwal.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors text-sm"
                    >
                      <td className="py-4 px-6 font-medium text-slate-800 dark:text-zinc-200 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          {item.waktu}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                        {item.mataKuliah}
                      </td>
                      <td className="py-4 px-6 font-bold text-indigo-600 dark:text-indigo-400">
                        {item.kelas || "-"}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-zinc-300">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          {item.dosen}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-zinc-300 font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                          {item.ruangan}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                            item.status === "Aman"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : item.status === "Potensi Bentrok"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse border border-amber-300 dark:border-amber-900/50"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
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
