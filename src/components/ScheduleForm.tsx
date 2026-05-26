import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, BrainCircuit, CalendarClock } from "lucide-react";

interface ScheduleFormProps {
  formData: {
    subject: string;
    class: string;
    lecturer: string;
    room: string;
    time: string;
  };
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenUploadModal: () => void;
}

export default function ScheduleForm({
  formData,
  isSubmitting,
  onInputChange,
  onSubmit,
  onOpenUploadModal,
}: ScheduleFormProps) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
          <CalendarClock className="h-5 w-5" />
        </div>
        <h2 className="text-base sm:text-lg font-bold">
          Input Jadwal Baru
        </h2>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end"
      >
        <div className="space-y-2">
          <Label
            htmlFor="subject"
            className="text-slate-600 dark:text-zinc-400"
          >
            Mata Kuliah
          </Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={onInputChange}
            placeholder="Contoh: Struktur Data"
            className="h-11 rounded-xl"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="class"
            className="text-slate-600 dark:text-zinc-400"
          >
            Kelas
          </Label>
          <Input
            id="class"
            value={formData.class}
            onChange={onInputChange}
            placeholder="Contoh: 4A / 4E"
            className="h-11 rounded-xl"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="lecturer"
            className="text-slate-600 dark:text-zinc-400"
          >
            Dosen Pengampu
          </Label>
          <Input
            id="lecturer"
            value={formData.lecturer}
            onChange={onInputChange}
            placeholder="Nama Dosen"
            className="h-11 rounded-xl"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="room"
            className="text-slate-600 dark:text-zinc-400"
          >
            Ruangan
          </Label>
          <Input
            id="room"
            value={formData.room}
            onChange={onInputChange}
            placeholder="Lab Komputer 2"
            className="h-11 rounded-xl"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="time"
            className="text-slate-600 dark:text-zinc-400"
          >
            Waktu
          </Label>
          <Input
            id="time"
            value={formData.time}
            onChange={onInputChange}
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
          onClick={onOpenUploadModal}
          disabled={isSubmitting}
          className="h-11 rounded-xl font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-400 w-full sm:w-auto"
        >
          <BrainCircuit className="mr-2 h-4 w-4" /> Import (AI)
        </Button>

        <Button
          type="button"
          onClick={onSubmit}
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
  );
}
