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
import { Plus, Trash2, MapPin, Loader2 } from "lucide-react";
import {
  getRuangan,
  addRuangan,
  deleteRuangan,
  RuanganData,
} from "@/app/actions/ruanganActions";

export default function RoomsPage() {
  const [ruanganList, setRuanganList] = useState<RuanganData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    kapasitas: "",
    fasilitas: "",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const data = await getRuangan();
    setRuanganList(data);
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

  const handleAddRuangan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.kapasitas) return;

    setIsSubmitting(true);

    await addRuangan({
      nama: formData.nama,
      kapasitas: parseInt(formData.kapasitas) || 0,
      fasilitas: formData.fasilitas || "-",
      status: "Tersedia",
    });

    await fetchData();
    setFormData({ nama: "", kapasitas: "", fasilitas: "" });
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    await deleteRuangan(id);
    await fetchData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Manajemen Ruangan &amp; Lab
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm sm:text-base">
            Kelola data fasilitas ruangan dan kapasitas lab.
          </p>
        </div>
      </div>

      {/* FORM INPUT SECTION */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <MapPin className="h-5 w-5" />
          </div>
          <h2 className="text-base sm:text-lg font-bold">Input Ruangan Baru</h2>
        </div>

        <form
          onSubmit={handleAddRuangan}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-slate-600 dark:text-zinc-400">
              Nama Ruangan / Lab
            </Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={handleInputChange}
              placeholder="Contoh: Lab Komputer 1"
              className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kapasitas" className="text-slate-600 dark:text-zinc-400">
              Kapasitas (Orang)
            </Label>
            <Input
              id="kapasitas"
              type="number"
              value={formData.kapasitas}
              onChange={handleInputChange}
              placeholder="Contoh: 40"
              className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fasilitas" className="text-slate-600 dark:text-zinc-400">
              Fasilitas (Opsional)
            </Label>
            <Input
              id="fasilitas"
              value={formData.fasilitas}
              onChange={handleInputChange}
              placeholder="Proyektor, AC, dll"
              className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              disabled={isSubmitting}
            />
          </div>
        </form>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleAddRuangan}
            disabled={isSubmitting}
            className="h-11 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 w-full sm:w-auto px-8 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Menyimpan..." : "Tambahkan Ruangan"}
          </Button>
        </div>
      </div>

      {/* TABLE SECTION — desktop */}
      <div className="hidden md:block rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-950/50">
              <TableRow className="border-slate-200 dark:border-white/5">
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 w-[250px]">
                  Nama Ruangan
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                  Kapasitas
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                  Fasilitas
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-center">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-400" />
                    Mengambil data...
                  </TableCell>
                </TableRow>
              ) : ruanganList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-slate-500 dark:text-zinc-500"
                  >
                    Belum ada data ruangan.
                  </TableCell>
                </TableRow>
              ) : (
                ruanganList.map((ruangan) => (
                  <TableRow
                    key={ruangan.id}
                    className="border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="font-medium">{ruangan.nama}</TableCell>
                    <TableCell className="text-slate-600 dark:text-zinc-300">
                      {ruangan.kapasitas} Mahasiswa
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-zinc-300">
                      {ruangan.fasilitas}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50"
                      >
                        {ruangan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(ruangan.id)}
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

      {/* CARD VIEW — mobile only */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            <p className="text-sm">Mengambil data...</p>
          </div>
        ) : ruanganList.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-center text-slate-500 dark:text-zinc-500 text-sm">
            Belum ada data ruangan.
          </div>
        ) : (
          ruanganList.map((ruangan) => (
            <div
              key={ruangan.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{ruangan.nama}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{ruangan.kapasitas} Mahasiswa</p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 shrink-0"
                >
                  {ruangan.status}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                <span className="font-semibold text-slate-700 dark:text-zinc-300">Fasilitas: </span>
                {ruangan.fasilitas}
              </div>
              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-white/5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(ruangan.id)}
                  className="text-red-500 hover:bg-red-50 rounded-lg text-xs h-8"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
