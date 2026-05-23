"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Users, Loader2 } from "lucide-react";
import {
  getDosen,
  addDosen,
  deleteDosen,
  DosenData,
} from "@/app/actions/dosenActions";

export default function LecturersPage() {
  const [dosenList, setDosenList] = useState<DosenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    keahlian: "",
    kontak: "",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const data = await getDosen();
    setDosenList(data);
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

  const handleAddDosen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nip) return;

    setIsSubmitting(true);

    await addDosen({
      nama: formData.nama,
      nip: formData.nip,
      keahlian: formData.keahlian || "-",
      kontak: formData.kontak || "-",
    });

    await fetchData();
    setFormData({ nama: "", nip: "", keahlian: "", kontak: "" });
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    await deleteDosen(id);
    await fetchData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Manajemen Dosen
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">
            Kelola data staf pengajar dan bidang keahlian.
          </p>
        </div>
      </div>

      {/* FORM INPUT SECTION */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold">Input Data Dosen</h2>
        </div>

        <form
          onSubmit={handleAddDosen}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-slate-600 dark:text-zinc-400">
              Nama Lengkap & Gelar
            </Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={handleInputChange}
              placeholder="Dr. Budi Santoso, M.Kom"
              className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nip" className="text-slate-600 dark:text-zinc-400">
              NIP / NIDN
            </Label>
            <Input
              id="nip"
              value={formData.nip}
              onChange={handleInputChange}
              placeholder="198001012005011001"
              className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keahlian" className="text-slate-600 dark:text-zinc-400">
              Bidang Keahlian
            </Label>
            <Input
              id="keahlian"
              value={formData.keahlian}
              onChange={handleInputChange}
              placeholder="Artificial Intelligence"
              className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kontak" className="text-slate-600 dark:text-zinc-400">
              Kontak / Email
            </Label>
            <Input
              id="kontak"
              value={formData.kontak}
              onChange={handleInputChange}
              placeholder="budi@upstegal.ac.id"
              className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              disabled={isSubmitting}
            />
          </div>
        </form>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleAddDosen}
            disabled={isSubmitting}
            className="h-11 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 w-full sm:w-auto px-8 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Menyimpan..." : "Tambahkan Dosen"}
          </Button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-950/50">
              <TableRow className="border-slate-200 dark:border-white/5">
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 w-[250px]">
                  Nama Dosen
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                  NIP / NIDN
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                  Bidang Keahlian
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                  Kontak
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
              ) : dosenList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-slate-500 dark:text-zinc-500"
                  >
                    Belum ada data dosen.
                  </TableCell>
                </TableRow>
              ) : (
                dosenList.map((dosen) => (
                  <TableRow
                    key={dosen.id}
                    className="border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="font-medium">{dosen.nama}</TableCell>
                    <TableCell className="text-slate-600 dark:text-zinc-300">
                      {dosen.nip}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-zinc-300">
                      {dosen.keahlian}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-zinc-300">
                      {dosen.kontak}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(dosen.id)}
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
