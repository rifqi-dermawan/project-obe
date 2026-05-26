import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LecturerData } from "@/app/actions/lecturerActions";

interface LecturerTableProps {
  lecturersList: LecturerData[];
  isLoading: boolean;
  isSyncing: boolean;
  onToggleMintaLab: (id: number, checked: boolean) => void;
  onDelete: (id: number) => void;
}

export default function LecturerTable({
  lecturersList,
  isLoading,
  isSyncing,
  onToggleMintaLab,
  onDelete,
}: LecturerTableProps) {
  return (
    <div className="hidden md:block rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-zinc-950/50">
            <TableRow className="border-slate-200 dark:border-white/5">
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 w-[250px]">
                Nama Dosen
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                NIP / NIDN
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                Bidang Keahlian
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400">
                Kontak
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-center">
                Minta Lab
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-zinc-400 text-right">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-400" />
                  Mengambil data...
                </TableCell>
              </TableRow>
            ) : lecturersList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-slate-500 dark:text-zinc-500"
                >
                  Belum ada data dosen.
                </TableCell>
              </TableRow>
            ) : (
              lecturersList.map((lecturer) => (
                <TableRow
                  key={lecturer.id}
                  className="border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <TableCell className="font-medium">{lecturer.name}</TableCell>
                  <TableCell className="text-slate-600 dark:text-zinc-300">
                    {lecturer.nip}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-zinc-300">
                    {lecturer.expertise}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-zinc-300">
                    {lecturer.contact}
                  </TableCell>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={lecturer.requestLab ?? false}
                      disabled={isSyncing || isLoading}
                      onChange={(e) => onToggleMintaLab(lecturer.id, e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(lecturer.id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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
