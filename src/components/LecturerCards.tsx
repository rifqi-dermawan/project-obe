import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LecturerData } from "@/app/actions/lecturerActions";

interface LecturerCardsProps {
  lecturersList: LecturerData[];
  isLoading: boolean;
  isSyncing: boolean;
  onToggleMintaLab: (id: number, checked: boolean) => void;
  onDelete: (id: number) => void;
}

export default function LecturerCards({
  lecturersList,
  isLoading,
  isSyncing,
  onToggleMintaLab,
  onDelete,
}: LecturerCardsProps) {
  return (
    <div className="md:hidden space-y-3">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <p className="text-sm">Mengambil data...</p>
        </div>
      ) : lecturersList.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-center text-slate-500 dark:text-zinc-500 text-sm">
          Belum ada data dosen.
        </div>
      ) : (
        lecturersList.map((lecturer) => (
          <div
            key={lecturer.id}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{lecturer.name}</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{lecturer.nip}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(lecturer.id)}
                className="text-red-500 hover:bg-red-50 rounded-lg text-xs h-8 shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400">
              <div>
                <span className="font-semibold text-slate-700 dark:text-zinc-300 block">Keahlian</span>
                <span className="truncate block max-w-[100px]">{lecturer.expertise}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700 dark:text-zinc-300 block">Kontak</span>
                <span className="truncate block max-w-[100px]">{lecturer.contact}</span>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-slate-100 dark:border-white/5 pl-2">
                <span className="font-semibold text-slate-700 dark:text-zinc-300 block mb-1">Minta Lab</span>
                <input
                  type="checkbox"
                  checked={lecturer.requestLab ?? false}
                  disabled={isSyncing || isLoading}
                  onChange={(e) => onToggleMintaLab(lecturer.id, e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
