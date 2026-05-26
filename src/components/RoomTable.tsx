import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Loader2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomData } from "@/app/actions/roomActions";

interface RoomTableProps {
  title: string;
  icon: string;
  roomsList: RoomData[];
  isLoading: boolean;
  onSelectQr: (room: RoomData) => void;
  onDelete: (id: number) => void;
  nameColorClass: string;
}

export default function RoomTable({
  title,
  icon,
  roomsList,
  isLoading,
  onSelectQr,
  onDelete,
  nameColorClass,
}: RoomTableProps) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        {icon} {title} ({roomsList.length})
      </h3>
      <div className="overflow-x-auto border border-slate-100 dark:border-white/5 rounded-xl">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-zinc-950/50">
            <TableRow className="border-slate-200 dark:border-white/5">
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 w-[250px]">
                Nama Ruangan
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                Kapasitas
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                Fasilitas
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-right">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-400" />
                </TableCell>
              </TableRow>
            ) : roomsList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-slate-400 dark:text-zinc-500 text-sm"
                >
                  Belum ada data {title.toLowerCase()}.
                </TableCell>
              </TableRow>
            ) : (
              roomsList.map((room) => (
                <TableRow
                  key={room.id}
                  className="border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <TableCell className={`font-semibold ${nameColorClass}`}>{room.name}</TableCell>
                  <TableCell className="text-slate-600 dark:text-zinc-300">
                    {room.capacity} Mahasiswa
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-zinc-300">
                    {room.facilities}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50"
                    >
                      {room.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectQr(room)}
                      className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                      title="Tampilkan QR Code"
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(room.id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Hapus"
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
  );
}
