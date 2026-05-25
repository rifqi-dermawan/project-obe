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
import { Plus, Trash2, Users, Loader2, RefreshCw } from "lucide-react";
import {
  getDosen,
  addDosen,
  deleteDosen,
  syncDosenWithEStaff,
  DosenData,
  toggleDosenMintaLab,
} from "@/app/actions/dosenActions";
import { toast } from "sonner";

export default function LecturersPage() {
  const [dosenList, setDosenList] = useState<DosenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [unmatchedDosen, setUnmatchedDosen] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    keahlian: "",
    kontak: "",
    mintaLab: false,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const data = await getDosen();
    setDosenList(data);
    setIsLoading(false);
  }, []);

  const handleSyncEStaff = async () => {
    setIsSyncing(true);
    setUnmatchedDosen([]);
    try {
      const result = await syncDosenWithEStaff();
      if (result.success) {
        toast.success("Sinkronisasi Berhasil", {
          description: result.message,
        });
        if (result.unmatchedNames && result.unmatchedNames.length > 0) {
          setUnmatchedDosen(result.unmatchedNames);
        }
        await fetchData();
      } else {
        toast.error("Sinkronisasi Gagal", {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error("Sinkronisasi Gagal", {
        description: "Gagal terhubung dengan server E-Staff UPS Tegal.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

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
      mintaLab: formData.mintaLab,
    });

    await fetchData();
    setFormData({ nama: "", nip: "", keahlian: "", kontak: "", mintaLab: false });
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    await deleteDosen(id);
    await fetchData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Manajemen Dosen
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm sm:text-base">
            Kelola data staf pengajar dan bidang keahlian.
          </p>
        </div>
        <Button
          onClick={handleSyncEStaff}
          disabled={isSyncing || isLoading || isSubmitting}
          className="h-11 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6 self-start sm:self-auto transition-all"
        >
          {isSyncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isSyncing ? "Mensinkronkan..." : "Sinkronisasi E-Staff"}
        </Button>
      </div>

      {unmatchedDosen.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 space-y-3 shadow-sm">
          <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
            ⚠️ Beberapa Dosen Belum Sinkron (Nama Tidak Cocok)
          </h3>
          <p className="text-xs sm:text-sm">
            Dosen berikut terdeteksi di jadwal kuliah Anda, tetapi **tidak dapat dicocokkan otomatis** dengan E-Staff (kemungkinan karena penulisan nama yang disingkat, tidak lengkap, atau ada perbedaan karakter). 
            Silakan edit nama mereka secara manual agar sama persis dengan nama resmi di E-Staff, lalu klik tombol **Sinkronisasi E-Staff** kembali untuk memperbarui NIP dan Email mereka:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm font-semibold pl-2 space-y-1">
            {unmatchedDosen.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* FORM INPUT SECTION */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-base sm:text-lg font-bold">Input Data Dosen</h2>
        </div>

        <form
          onSubmit={handleAddDosen}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
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
          <div className="flex items-center gap-2 h-11 px-3 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-zinc-950/50">
            <input
              type="checkbox"
              id="mintaLab"
              checked={formData.mintaLab ?? false}
              onChange={(e) => setFormData({ ...formData, mintaLab: e.target.checked })}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
              disabled={isSubmitting}
            />
            <Label htmlFor="mintaLab" className="text-slate-600 dark:text-zinc-400 font-semibold cursor-pointer text-xs sm:text-sm">
              Minta Ruang Lab
            </Label>
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

      {/* TABLE SECTION — desktop */}
      <div className="hidden md:block rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
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
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-center">
                  Minta Lab
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-400" />
                    Mengambil data...
                  </TableCell>
                </TableRow>
              ) : dosenList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={dosen.mintaLab ?? false}
                        disabled={isSyncing || isLoading}
                        onChange={async (e) => {
                          const checked = e.target.checked;
                          // Update UI optimistik
                          setDosenList((prev) =>
                            prev.map((d) => (d.id === dosen.id ? { ...d, mintaLab: checked } : d))
                          );
                          const res = await toggleDosenMintaLab(dosen.id, checked);
                          if (res.success) {
                            toast.success("Preferensi diperbarui", {
                              description: `Preferensi lab untuk ${dosen.nama} berhasil diubah.`,
                            });
                          } else {
                            toast.error("Gagal memperbarui preferensi");
                            fetchData(); // Rollback ke data asli
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
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

      {/* CARD VIEW — mobile only */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            <p className="text-sm">Mengambil data...</p>
          </div>
        ) : dosenList.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-center text-slate-500 dark:text-zinc-500 text-sm">
            Belum ada data dosen.
          </div>
        ) : (
          dosenList.map((dosen) => (
            <div
              key={dosen.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{dosen.nama}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{dosen.nip}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(dosen.id)}
                  className="text-red-500 hover:bg-red-50 rounded-lg text-xs h-8 shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300 block">Keahlian</span>
                  <span className="truncate block max-w-[100px]">{dosen.keahlian}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300 block">Kontak</span>
                  <span className="truncate block max-w-[100px]">{dosen.kontak}</span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-slate-100 dark:border-white/5 pl-2">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Minta Lab</span>
                  <input
                    type="checkbox"
                    checked={dosen.mintaLab ?? false}
                    disabled={isSyncing || isLoading}
                    onChange={async (e) => {
                      const checked = e.target.checked;
                      // Update UI optimistik
                      setDosenList((prev) =>
                        prev.map((d) => (d.id === dosen.id ? { ...d, mintaLab: checked } : d))
                      );
                      const res = await toggleDosenMintaLab(dosen.id, checked);
                      if (res.success) {
                        toast.success("Preferensi diperbarui", {
                          description: `Preferensi lab untuk ${dosen.nama} berhasil diubah.`,
                        });
                      } else {
                        toast.error("Gagal memperbarui preferensi");
                        fetchData(); // Rollback ke data asli
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
