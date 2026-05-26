import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MapPin, Loader2 } from "lucide-react";

interface RoomFormProps {
  formData: {
    name: string;
    capacity: string;
    facilities: string;
  };
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RoomForm({
  formData,
  isSubmitting,
  onInputChange,
  onSubmit,
}: RoomFormProps) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <MapPin className="h-5 w-5" />
        </div>
        <h2 className="text-base sm:text-lg font-bold">Input Ruangan Baru</h2>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-600 dark:text-zinc-400">
            Nama Ruangan / Lab
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Contoh: Lab Komputer 1"
            className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity" className="text-slate-600 dark:text-zinc-400">
            Kapasitas (Orang)
          </Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={onInputChange}
            placeholder="Contoh: 40"
            className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="facilities" className="text-slate-600 dark:text-zinc-400">
            Fasilitas (Opsional)
          </Label>
          <Input
            id="facilities"
            value={formData.facilities}
            onChange={onInputChange}
            placeholder="Proyektor, AC, dll"
            className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
            disabled={isSubmitting}
          />
        </div>
      </form>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={onSubmit}
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
  );
}
