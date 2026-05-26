import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, Loader2 } from "lucide-react";

interface LecturerFormProps {
  formData: {
    name: string;
    nip: string;
    expertise: string;
    contact: string;
    requestLab: boolean;
  };
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LecturerForm({
  formData,
  isSubmitting,
  onInputChange,
  onCheckboxChange,
  onSubmit,
}: LecturerFormProps) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
          <Users className="h-5 w-5" />
        </div>
        <h2 className="text-base sm:text-lg font-bold">Input Data Dosen</h2>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-600 dark:text-zinc-400">
            Nama Lengkap &amp; Gelar
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={onInputChange}
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
            onChange={onInputChange}
            placeholder="198001012005011001"
            className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expertise" className="text-slate-600 dark:text-zinc-400">
            Bidang Keahlian
          </Label>
          <Input
            id="expertise"
            value={formData.expertise}
            onChange={onInputChange}
            placeholder="Artificial Intelligence"
            className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact" className="text-slate-600 dark:text-zinc-400">
            Kontak / Email
          </Label>
          <Input
            id="contact"
            value={formData.contact}
            onChange={onInputChange}
            placeholder="budi@upstegal.ac.id"
            className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex items-center gap-2 h-11 px-3 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-zinc-950/50">
          <input
            type="checkbox"
            id="requestLab"
            checked={formData.requestLab ?? false}
            onChange={onCheckboxChange}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            disabled={isSubmitting}
          />
          <Label htmlFor="requestLab" className="text-slate-600 dark:text-zinc-400 font-semibold cursor-pointer text-xs sm:text-sm">
            Minta Ruang Lab
          </Label>
        </div>
      </form>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={onSubmit}
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
  );
}
