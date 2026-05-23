"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, CalendarClock, Loader2 } from "lucide-react";
import {
  getJadwal,
  addJadwal,
  deleteJadwal,
  JadwalData,
} from "@/app/actions/jadwalActions";



export default function SchedulePage() {
  const [jadwalList, setJadwalList] = useState<JadwalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    mataKuliah: "",
    dosen: "",
    ruangan: "",
    waktu: "",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const data = await getJadwal();
    setJadwalList(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);

    // Cleanup function
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAddJadwal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.mataKuliah ||
      !formData.dosen ||
      !formData.ruangan ||
      !formData.waktu
    )
      return;

    setIsSubmitting(true);

    // Algoritma Decision Tree Sederhana: Deteksi Bentrok
    const isBentrok = jadwalList.some(
      (j) => j.ruangan === formData.ruangan && j.waktu === formData.waktu,
    );
    const calculatedStatus = isBentrok ? "Bentrok" : "Aman";

    // Simpan ke Database
    await addJadwal({
      ...formData,
      status: calculatedStatus,
    });

    // Refresh tabel & bersihkan form
    await fetchData();
    setFormData({ mataKuliah: "", dosen: "", ruangan: "", waktu: "" });
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    await deleteJadwal(id);
    await fetchData(); // Refresh data setelah dihapus
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Manajemen Penjadwalan
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">
            Kelola dan analisis jadwal kelas & lab
          </p>
        </div>
      </div>

      {/* FORM INPUT SECTION */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <CalendarClock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold">Input Jadwal Baru</h2>
        </div>

        <form
          onSubmit={handleAddJadwal}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          <div className="space-y-2">
            <Label
              htmlFor="mataKuliah"
              className="text-slate-600 dark:text-zinc-400"
            >
              Mata Kuliah
            </Label>
            <Input
              id="mataKuliah"
              value={formData.mataKuliah}
              onChange={handleInputChange}
              placeholder="Contoh: Struktur Data"
              className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="dosen"
              className="text-slate-600 dark:text-zinc-400"
            >
              Dosen Pengampu
            </Label>
            <Input
              id="dosen"
              value={formData.dosen}
              onChange={handleInputChange}
              placeholder="Nama Dosen"
              className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="ruangan"
              className="text-slate-600 dark:text-zinc-400"
            >
              Ruangan
            </Label>
            <Input
              id="ruangan"
              value={formData.ruangan}
              onChange={handleInputChange}
              placeholder="Lab Komputer 2"
              className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="waktu"
              className="text-slate-600 dark:text-zinc-400"
            >
              Waktu
            </Label>
            <Input
              id="waktu"
              value={formData.waktu}
              onChange={handleInputChange}
              placeholder="Rabu, 13:00 - 15:30"
              className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              disabled={isSubmitting}
            />
          </div>
        </form>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleAddJadwal}
            disabled={isSubmitting}
            className="h-11 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-zinc-200 w-full sm:w-auto px-8 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Menyimpan..." : "Tambahkan Jadwal"}
          </Button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-950/50">
              <TableRow className="border-slate-200 dark:border-white/5">
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 w-[200px]">
                  Mata Kuliah
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                  Dosen
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                  Ruangan
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                  Waktu
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-center">
                  Status Kelas
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-slate-500"
                  >
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-400" />
                    Mengambil data...
                  </TableCell>
                </TableRow>
              ) : jadwalList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-slate-500 dark:text-zinc-500"
                  >
                    Belum ada data jadwal. Silakan tambahkan di atas.
                  </TableCell>
                </TableRow>
              ) : (
                jadwalList.map((jadwal) => (
                  <TableRow
                    key={jadwal.id}
                    className="border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {jadwal.mataKuliah}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-zinc-300">
                      {jadwal.dosen}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-zinc-300">
                      {jadwal.ruangan}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-zinc-300">
                      {jadwal.waktu}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          jadwal.status === "Aman" ? "default" : "destructive"
                        }
                        className={
                          jadwal.status === "Aman"
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                        }
                      >
                        {jadwal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(jadwal.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
