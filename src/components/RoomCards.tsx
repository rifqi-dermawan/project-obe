import React from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, QrCode, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomData } from "@/app/actions/roomActions";

interface RoomCardsProps {
  laboratoriumList: RoomData[];
  ruanganKelasList: RoomData[];
  isLoading: boolean;
  onSelectQr: (room: RoomData) => void;
  onDelete: (id: number) => void;
}

export default function RoomCards({
  laboratoriumList,
  ruanganKelasList,
  isLoading,
  onSelectQr,
  onDelete,
}: RoomCardsProps) {
  if (isLoading) {
    return (
      <div className="md:hidden flex flex-col items-center justify-center py-12 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
        <p className="text-sm">Mengambil data...</p>
      </div>
    );
  }

  if (laboratoriumList.length === 0 && ruanganKelasList.length === 0) {
    return (
      <div className="md:hidden p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-center text-slate-500 dark:text-zinc-500 text-sm">
        Belum ada data ruangan.
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-6">
      {/* Lab Cards Group */}
      {laboratoriumList.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 dark:text-white pl-1 flex items-center gap-2 text-sm sm:text-base">
            🔬 Laboratorium ({laboratoriumList.length})
          </h3>
          {laboratoriumList.map((room) => (
            <div
              key={room.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{room.name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{room.capacity} Mahasiswa</p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 shrink-0"
                >
                  {room.status}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                <span className="font-semibold text-slate-700 dark:text-zinc-300">Fasilitas: </span>
                {room.facilities}
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectQr(room)}
                  className="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg text-xs h-8"
                >
                  <QrCode className="h-3.5 w-3.5 mr-1" /> QR Code
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(room.id)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-xs h-8"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Cards Group */}
      {ruanganKelasList.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="font-bold text-slate-800 dark:text-white pl-1 flex items-center gap-2 text-sm sm:text-base">
            🏫 Ruangan Kelas ({ruanganKelasList.length})
          </h3>
          {ruanganKelasList.map((room) => (
            <div
              key={room.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800 dark:text-zinc-200">{room.name}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{room.capacity} Mahasiswa</p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 shrink-0"
                >
                  {room.status}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                <span className="font-semibold text-slate-700 dark:text-zinc-300">Fasilitas: </span>
                {room.facilities}
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectQr(room)}
                  className="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg text-xs h-8"
                >
                  <QrCode className="h-3.5 w-3.5 mr-1" /> QR Code
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(room.id)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-xs h-8"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
