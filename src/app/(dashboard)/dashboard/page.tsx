import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic"; // Memastikan data realtime

export default async function DashboardPage() {
  // Mengambil data secara realtime dari database
  const totalJadwal = await prisma.jadwal.count();
  const jadwalBentrok = await prisma.jadwal.count({ where: { status: "Bentrok" } });
  const jadwalSelesai = totalJadwal; // Semua jadwal yang masuk sudah dianalisis oleh sistem
  const totalRuangan = await prisma.ruangan.count();

  // Menghitung efisiensi secara dinamis (asumsi 1 lab bisa dipakai 10 slot jadwal per minggu)
  const kapasitasMaksimal = totalRuangan * 10;
  const efisiensi =
    totalRuangan === 0
      ? 0
      : Math.min(100, Math.round((totalJadwal / kapasitasMaksimal) * 100));

  const stats = [
    {
      label: "Total Jadwal",
      value: totalJadwal.toString(),
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Selesai Analisis",
      value: jadwalSelesai.toString(),
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Potensi Bentrok",
      value: jadwalBentrok.toString(),
      icon: AlertCircle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Efisiensi Ruang",
      value: `${efisiensi}%`,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const aktivitasTerakhir = await prisma.jadwal.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Ringkasan Analisis
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-1">
          Data penjadwalan Informatika Universitas Pancasakti Tegal.
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY & CHART PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm h-[400px]">
          <h3 className="font-bold text-lg mb-4">Grafik Penggunaan Lab</h3>
          <div className="flex items-center justify-center h-full text-slate-400 italic">
            [ Area Grafik Decision Tree Akan Muncul Di Sini ]
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Aktivitas Terakhir</h3>
            <Link href="/dashboard/schedule">
              <Button variant="ghost" size="sm" className="text-xs">
                Lihat Semua
              </Button>
            </Link>
          </div>
          <div className="space-y-6">
            {aktivitasTerakhir.length === 0 ? (
              <p className="text-sm text-slate-500 italic text-center py-4">
                Belum ada aktivitas.
              </p>
            ) : (
              aktivitasTerakhir.map((jadwal) => (
                <div key={jadwal.id} className="flex gap-4 items-start">
                  <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${jadwal.status === 'Bentrok' ? 'bg-amber-500' : 'bg-green-500'}`} />
                  <div>
                    <p className="text-sm font-bold truncate max-w-[200px]">
                      {jadwal.mataKuliah}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
                      Ruang: {jadwal.ruangan} - {jadwal.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/dashboard/schedule" className="block mt-8">
            <Button className="w-full rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold h-11">
              Buat Jadwal Baru <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
