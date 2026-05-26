import React from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JadwalData } from "@/app/actions/scheduleActions";

interface ScheduleCardsProps {
  jadwalList: JadwalData[];
  isLoading: boolean;
  onEdit: (jadwal: JadwalData) => void;
  onDelete: (id: number) => void;
}

export default function ScheduleCards({
  jadwalList,
  isLoading,
  onEdit,
  onDelete,
}: ScheduleCardsProps) {
  return (
    <div className="md:hidden space-y-3">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <p className="text-sm">Mengambil data...</p>
        </div>
      ) : jadwalList.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-center text-slate-500 dark:text-zinc-500 text-sm">
          Belum ada data jadwal. Silakan tambahkan di atas atau gunakan
          Import AI.
        </div>
      ) : (
        jadwalList.map((jadwal) => (
          <div
            key={jadwal.id}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">
                  {jadwal.subject}{" "}
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    ({jadwal.class || "-"})
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  {jadwal.lecturer}
                </p>
              </div>
              <Badge
                variant={
                  jadwal.status === "Aman"
                    ? "default"
                    : jadwal.status === "Potensi Bentrok"
                      ? "outline"
                      : "destructive"
                }
                className={
                  jadwal.status === "Aman"
                    ? "bg-green-100 text-green-700 border-transparent shrink-0 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                    : jadwal.status === "Potensi Bentrok"
                      ? "bg-amber-100 text-amber-700 border-amber-300 shrink-0 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50 animate-pulse"
                      : "bg-red-100 text-red-700 border-transparent shrink-0 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                }
              >
                {jadwal.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-zinc-400 mb-3">
              <div>
                <span className="font-semibold text-slate-700 dark:text-zinc-300 block">
                  Ruangan
                </span>
                {jadwal.room}
              </div>
              <div>
                <span className="font-semibold text-slate-700 dark:text-zinc-300 block">
                  Waktu
                </span>
                {jadwal.time}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(jadwal)}
                className="text-amber-600 hover:bg-amber-50 rounded-lg text-xs h-8"
              >
                <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(jadwal.id)}
                className="text-red-500 hover:bg-red-50 rounded-lg text-xs h-8"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
