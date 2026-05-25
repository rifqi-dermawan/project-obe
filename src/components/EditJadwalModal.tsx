"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JadwalData } from "@/app/actions/jadwalActions";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  jadwal: JadwalData | null;
  onSave: (id: number, updatedData: Omit<JadwalData, "id">) => Promise<void>;
};

export default function EditJadwalModal({
  isOpen,
  onClose,
  jadwal,
  onSave,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    mataKuliah: "",
    dosen: "",
    ruangan: "",
    waktu: "",
    status: "",
  });

  useEffect(() => {
    if (jadwal) {
      setFormData({
        mataKuliah: jadwal.mataKuliah,
        dosen: jadwal.dosen,
        ruangan: jadwal.ruangan,
        waktu: jadwal.waktu,
        status: jadwal.status,
      });
    }
  }, [jadwal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jadwal) return;

    setIsSubmitting(true);
    await onSave(jadwal.id, formData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && jadwal && (
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
              className="w-full max-w-md sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-zinc-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    Sunting Jadwal
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 cursor-pointer rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="mataKuliah">Mata Kuliah</Label>
                  <Input
                    id="mataKuliah"
                    value={formData.mataKuliah}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosen">Dosen</Label>
                  <Input
                    id="dosen"
                    value={formData.dosen}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruangan">Ruangan / Lab</Label>
                  <Input
                    id="ruangan"
                    value={formData.ruangan}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waktu">Waktu</Label>
                  <Input
                    id="waktu"
                    value={formData.waktu}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 cursor-pointer rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 cursor-pointer rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
