"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Loader2, X, BrainCircuit } from "lucide-react";
// Ganti icon di atas dengan Phosphor Icons sesuai aturan globals jika sudah terpasang

// 1. Definisikan tipe data yang diharapkan dari hasil kembalian AI
export type JadwalHasilAI = {
  subject: string;
  class: string;
  lecturer: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: JadwalHasilAI[]) => void;
};

export default function UploadScheduleModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Silakan pilih file terlebih dahulu.");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-jadwal", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // TypeScript sekarang tahu persis bentuk 'result.data'
        onSuccess(result.data as JadwalHasilAI[]);
        onClose();
      } else {
        setError(result.error || "Terjadi kesalahan saat memproses data.");
      }
    } catch {
      setError("Gagal terhubung ke AI Engine.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* Header Modal */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    AI Jadwal Import
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Modal */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                  Unggah dokumen jadwal (JSON, CSV, EXCEL, atau PDF). Sistem cerdas kami akan
                  otomatis membaca kolom mata kuliah, ruangan, waktu, dan
                  mendeteksi bentrok.
                </p>

                <div className="relative border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-zinc-950/50">
                  <input
                    type="file"
                    accept=".json,.csv,.xls,.xlsx,.pdf,application/json,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="p-4 bg-white dark:bg-zinc-900 shadow-sm rounded-full mb-4">
                    {file ? (
                      <FileText className="w-8 h-8 text-indigo-500" />
                    ) : (
                      <UploadCloud className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
                    {file ? file.name : "Klik atau seret dokumen ke sini"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-500">
                    Maksimal ukuran file 5MB
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium">
                    {error}
                  </div>
                )}
              </div>

              {/* Footer Modal */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-950/50 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="px-5 py-2.5 cursor-pointer rounded-xl text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isProcessing || !file}
                  className="px-5 py-2.5 cursor-pointer rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <BrainCircuit className="w-4 h-4" />
                  )}
                  {isProcessing
                    ? "AI Sedang Menganalisis..."
                    : "Mulai Analisis"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
