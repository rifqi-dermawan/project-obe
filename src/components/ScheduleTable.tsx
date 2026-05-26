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
import { Trash2, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JadwalData } from "@/app/actions/scheduleActions";

interface ScheduleTableProps {
  jadwalList: JadwalData[];
  isLoading: boolean;
  onEdit: (jadwal: JadwalData) => void;
  onDelete: (id: number) => void;
}

export default function ScheduleTable({
  jadwalList,
  isLoading,
  onEdit,
  onDelete,
}: ScheduleTableProps) {
  return (
    <div className="hidden md:block rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-zinc-950/50">
            <TableRow className="border-slate-200 dark:border-white/5">
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 w-[200px]">
                Mata Kuliah
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                Kelas
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                Dosen
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                Ruangan
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                Waktu
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-center">
                Status Kelas
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-right">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-slate-500"
                >
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-400" />{" "}
                  Mengambil data...
                </TableCell>
              </TableRow>
            ) : jadwalList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-slate-500 dark:text-zinc-500"
                >
                  Belum ada data jadwal. Silakan tambahkan di atas atau
                  gunakan Import AI.
                </TableCell>
              </TableRow>
            ) : (
              jadwalList.map((jadwal) => (
                <TableRow
                  key={jadwal.id}
                  className="border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <TableCell className="font-medium">
                    {jadwal.subject}
                  </TableCell>
                  <TableCell className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {jadwal.class || "-"}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-zinc-300">
                    {jadwal.lecturer}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-zinc-300">
                    {jadwal.room}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-zinc-300">
                    {jadwal.time}
                  </TableCell>
                  <TableCell className="text-center">
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
                          ? "bg-green-100 text-green-700 border-transparent hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                          : jadwal.status === "Potensi Bentrok"
                            ? "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50 animate-pulse"
                            : "bg-red-100 text-red-700 border-transparent hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                      }
                    >
                      {jadwal.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(jadwal)}
                      className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(jadwal.id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
