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
import {
  Plus,
  Trash2,
  Edit2,
  CalendarClock,
  Loader2,
  BrainCircuit,
} from "lucide-react";
import UploadJadwalModal, {
  JadwalHasilAI,
} from "@/components/UploadJadwalModal";
import EditJadwalModal from "@/components/EditJadwalModal";
import { toast } from "sonner"; // <-- Import Sonner Toast
import {
  getJadwal,
  addJadwal,
  deleteJadwal,
  updateJadwal,
  JadwalData,
} from "@/app/actions/jadwalActions";

export default function SchedulePage() {
  const [jadwalList, setJadwalList] = useState<JadwalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalData | null>(null);

  const [formData, setFormData] = useState({
    mataKuliah: "",
    kelas: "",
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
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAddJadwal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.mataKuliah ||
      !formData.kelas ||
      !formData.dosen ||
      !formData.ruangan ||
      !formData.waktu
    )
      return;

    setIsSubmitting(true);
    const isBentrok = jadwalList.some(
      (j) => j.ruangan === formData.ruangan && j.waktu === formData.waktu,
    );
    const calculatedStatus = isBentrok ? "Bentrok" : "Aman";

    const result = await addJadwal({ ...formData, status: calculatedStatus });
    await fetchData();

    if (result.success) {
      toast.success("Jadwal Baru Ditambahkan", {
        description: `${formData.mataKuliah} (${formData.kelas}) berhasil disimpan.`,
      });
      setFormData({ mataKuliah: "", kelas: "", dosen: "", ruangan: "", waktu: "" });
    } else {
      toast.error("Gagal Menyimpan", {
        description: "Terjadi kesalahan saat menghubungi database.",
      });
    }

    setIsSubmitting(false);
  };

  const handleAIUploadSuccess = async (dataFromAI: JadwalHasilAI[]) => {
    setIsSubmitting(true);
    try {
      for (const item of dataFromAI) {
        const waktuFormatted = `${item.hari}, ${item.jamMulai} - ${item.jamSelesai}`;
        const isBentrok = jadwalList.some(
          (j) => j.ruangan === item.ruangan && j.waktu === waktuFormatted,
        );
        const calculatedStatus = isBentrok ? "Bentrok" : "Aman";

        await addJadwal({
          mataKuliah: item.mataKuliah,
          kelas: item.kelas || "-",
          dosen: item.dosen,
          ruangan: item.ruangan,
          waktu: waktuFormatted,
          status: calculatedStatus,
        });
      }
      await fetchData();
      toast.success("Analisis AI Berhasil!", {
        description: `${dataFromAI.length} jadwal otomatis ditambahkan dari dokumen.`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal Memproses Data AI", {
        description: "Terjadi kesalahan saat menyimpan ke database.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteJadwal(id);
    await fetchData();
    if (result.success) {
      toast.info("Jadwal Dihapus", {
        description: "Data jadwal telah dihapus dari sistem.",
      });
    }
  };

  const handleOpenEdit = (jadwal: JadwalData) => {
    setSelectedJadwal(jadwal);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (
    id: number,
    updatedData: Omit<JadwalData, "id">,
  ) => {
    const isBentrok = jadwalList.some(
      (j) =>
        j.id !== id &&
        j.ruangan === updatedData.ruangan &&
        j.waktu === updatedData.waktu,
    );
    const calculatedStatus = isBentrok ? "Bentrok" : "Aman";

    const result = await updateJadwal(id, {
      ...updatedData,
      status: calculatedStatus,
    });
    await fetchData();

    if (result.success) {
      toast.success("Perubahan Disimpan", {
        description: "Jadwal berhasil diperbarui.",
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Manajemen Penjadwalan
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm sm:text-base">
            Kelola dan analisis jadwal kelas &amp; lab
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <CalendarClock className="h-5 w-5" />
          </div>
          <h2 className="text-base sm:text-lg font-bold">Input Jadwal Baru</h2>
        </div>

        <form
          onSubmit={handleAddJadwal}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end"
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
              className="h-11 rounded-xl"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="kelas"
              className="text-slate-600 dark:text-zinc-400"
            >
              Kelas
            </Label>
            <Input
              id="kelas"
              value={formData.kelas}
              onChange={handleInputChange}
              placeholder="Contoh: 4A / 4E"
              className="h-11 rounded-xl"
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
              className="h-11 rounded-xl"
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
              className="h-11 rounded-xl"
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
              className="h-11 rounded-xl"
              disabled={isSubmitting}
            />
          </div>
        </form>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsUploadModalOpen(true)}
            disabled={isSubmitting}
            className="h-11 rounded-xl font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-400 w-full sm:w-auto"
          >
            <BrainCircuit className="mr-2 h-4 w-4" /> Import (AI)
          </Button>

          <Button
            type="button"
            onClick={handleAddJadwal}
            disabled={isSubmitting}
            className="h-11 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 w-full sm:w-auto px-8"
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

      {/* TABLE — desktop */}
      <div className="hidden md:block rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-950/50">
              <TableRow className="border-slate-200 dark:border-white/5">
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 w-[200px]">
                  Mata Kuliah
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                  Kelas
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
                    colSpan={7}
                    className="h-32 text-center text-slate-500"
                  >
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-400" />{" "}
                    Mengambil data...
                  </TableCell>
                </TableRow>
              ) : jadwalList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-slate-500 dark:text-zinc-500"
                  >
                    Belum ada data jadwal. Silakan tambahkan di atas atau
                    gunakan Import AI.
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
                    <TableCell className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {jadwal.kelas || "-"}
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
                          jadwal.status === "Aman"
                            ? "default"
                            : jadwal.status === "Potensi Bentrok"
                            ? "outline"
                            : "destructive"
                        }
                        className={
                          jadwal.status === "Aman"
                            ? "bg-green-100 text-green-700 border-transparent hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                            : jadwal.status === "Potensi Bentrok"
                            ? "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50 animate-pulse"
                            : "bg-red-100 text-red-700 border-transparent hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                        }
                      >
                        {jadwal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(jadwal)}
                        className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(jadwal.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* CARD VIEW — mobile only */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            <p className="text-sm">Mengambil data...</p>
          </div>
        ) : jadwalList.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-center text-slate-500 dark:text-zinc-500 text-sm">
            Belum ada data jadwal. Silakan tambahkan di atas atau gunakan Import AI.
          </div>
        ) : (
          jadwalList.map((jadwal) => (
            <div
              key={jadwal.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">
                    {jadwal.mataKuliah}{" "}
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      ({jadwal.kelas || "-"})
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{jadwal.dosen}</p>
                </div>
                <Badge
                  variant={
                    jadwal.status === "Aman"
                      ? "default"
                      : jadwal.status === "Potensi Bentrok"
                      ? "outline"
                      : "destructive"
                  }
                  className={
                    jadwal.status === "Aman"
                      ? "bg-green-100 text-green-700 border-transparent shrink-0 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                      : jadwal.status === "Potensi Bentrok"
                      ? "bg-amber-100 text-amber-700 border-amber-300 shrink-0 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50 animate-pulse"
                      : "bg-red-100 text-red-700 border-transparent shrink-0 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                  }
                >
                  {jadwal.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-zinc-400 mb-3">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300 block">Ruangan</span>
                  {jadwal.ruangan}
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300 block">Waktu</span>
                  {jadwal.waktu}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(jadwal)}
                  className="text-amber-600 hover:bg-amber-50 rounded-lg text-xs h-8"
                >
                  <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(jadwal.id)}
                  className="text-red-500 hover:bg-red-50 rounded-lg text-xs h-8"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <UploadJadwalModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleAIUploadSuccess}
      />
      <EditJadwalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        jadwal={selectedJadwal}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
