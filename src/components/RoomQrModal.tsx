import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { RoomData } from "@/app/actions/roomActions";

interface RoomQrModalProps {
  selectedQrRoom: RoomData | null;
  onClose: () => void;
  getStudentUrl: (roomName: string) => string;
}

export default function RoomQrModal({
  selectedQrRoom,
  onClose,
  getStudentUrl,
}: RoomQrModalProps) {
  return (
    <AnimatePresence>
      {selectedQrRoom && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 pointer-events-auto text-center space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-3">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                  QR Code Ruangan
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-indigo-600 dark:text-indigo-400 text-lg">
                  {selectedQrRoom.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Cetak dan tempel QR code ini di depan pintu ruangan. 
                  Mahasiswa dapat memindainya untuk melihat jadwal perkuliahan hari ini.
                </p>
              </div>

              <div className="py-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getStudentUrl(selectedQrRoom.name))}`}
                  alt={`QR Code ${selectedQrRoom.name}`}
                  className="border-4 border-white rounded-xl shadow-sm bg-white w-[180px] h-[180px]"
                />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-[320px] mx-auto">
                  {getStudentUrl(selectedQrRoom.name)}
                </p>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(getStudentUrl(selectedQrRoom.name))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Buka QR Code Resolusi Tinggi
                </a>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
