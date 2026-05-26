"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import {
  getLecturers,
  addLecturer,
  deleteLecturer,
  syncLecturerWithEStaff,
  LecturerData,
  toggleLecturerRequestLab,
} from "@/app/actions/lecturerActions";
import { toast } from "sonner";
import LecturerForm from "@/components/LecturerForm";
import LecturerTable from "@/components/LecturerTable";
import LecturerCards from "@/components/LecturerCards";

export default function LecturersPage() {
  const [lecturersList, setLecturersList] = useState<LecturerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [unmatchedDosen, setUnmatchedDosen] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    expertise: "",
    contact: "",
    requestLab: false,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const data = await getLecturers();
    setLecturersList(data);
    setIsLoading(false);
  }, []);

  const handleSyncEStaff = async () => {
    setIsSyncing(true);
    setUnmatchedDosen([]);
    try {
      const result = await syncLecturerWithEStaff();
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, requestLab: e.target.checked });
  };

  const handleAddDosen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nip) return;

    setIsSubmitting(true);

    await addLecturer({
      name: formData.name,
      nip: formData.nip,
      expertise: formData.expertise || "-",
      contact: formData.contact || "-",
      requestLab: formData.requestLab,
    });

    await fetchData();
    setFormData({ name: "", nip: "", expertise: "", contact: "", requestLab: false });
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    await deleteLecturer(id);
    await fetchData();
  };

  const handleToggleMintaLab = async (id: number, checked: boolean) => {
    // Update UI optimistik
    setLecturersList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, requestLab: checked } : d))
    );
    const res = await toggleLecturerRequestLab(id, checked);
    if (res.success) {
      const targetLecturer = lecturersList.find((d) => d.id === id);
      toast.success("Preferensi diperbarui", {
        description: `Preferensi lab untuk ${targetLecturer?.name || "Dosen"} berhasil diubah.`,
      });
    } else {
      toast.error("Gagal memperbarui preferensi");
      fetchData(); // Rollback ke data asli
    }
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

      <LecturerForm
        formData={formData}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
        onCheckboxChange={handleCheckboxChange}
        onSubmit={handleAddDosen}
      />

      <LecturerTable
        lecturersList={lecturersList}
        isLoading={isLoading}
        isSyncing={isSyncing}
        onToggleMintaLab={handleToggleMintaLab}
        onDelete={handleDelete}
      />

      <LecturerCards
        lecturersList={lecturersList}
        isLoading={isLoading}
        isSyncing={isSyncing}
        onToggleMintaLab={handleToggleMintaLab}
        onDelete={handleDelete}
      />
    </div>
  );
}
