"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Calendar, Award } from "lucide-react";

export default function DecisionTreePreview() {
  // Mock data untuk simulasi visualisasi decision tree
  const treeNodes = [
    { id: "root", label: "Input Jadwal Baru", x: 120, y: 150, type: "input" },
    { id: "check_room", label: "Kapasitas Ruang?", x: 280, y: 100, type: "decision" },
    { id: "check_dosen", label: "Ketersediaan Dosen?", x: 280, y: 200, type: "decision" },
    { id: "conflict", label: "Jadwal Bentrok", x: 440, y: 70, type: "error" },
    { id: "resolve", label: "Aman (Decision Tree)", x: 440, y: 150, type: "success" },
    { id: "ok", label: "Aman Terjadwal", x: 440, y: 230, type: "success" },
  ];

  const connections = [
    { from: "root", to: "check_room" },
    { from: "root", to: "check_dosen" },
    { from: "check_room", to: "conflict" },
    { from: "check_room", to: "resolve" },
    { from: "check_dosen", to: "ok" },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 text-white select-none">
      {/* Background radial gradient halus */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-950 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.05),transparent_50%)] -z-10" />

      {/* Header Info */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          Sistem Optimasi Kelas
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          Penjadwalan Otomatis berbasis Decision Tree
        </h2>
        <p className="text-sm text-slate-400 max-w-md">
          Menganalisis potensi bentrok jadwal kuliah secara real-time berdasarkan kapasitas ruangan, preferensi lab, dan ketersediaan dosen.
        </p>
      </div>

      {/* Visualisasi Skema Decision Tree (Bersih, Realistis, Bukan AI Slop) */}
      <div className="my-8 flex-1 flex items-center justify-center min-h-[260px] relative overflow-hidden bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
        <svg className="w-full h-full max-w-[550px] min-h-[220px]" viewBox="0 0 550 300">
          {/* Menggambar garis koneksi antar node */}
          {connections.map((conn, idx) => {
            const fromNode = treeNodes.find((n) => n.id === conn.from);
            const toNode = treeNodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={idx}>
                {/* Garis background statis */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="rgba(71, 85, 105, 0.4)"
                  strokeWidth="1.5"
                />
                {/* Garis animasi aliran data */}
                <motion.line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={toNode.type === "error" ? "#f59e0b" : "#6366f1"}
                  strokeWidth="2"
                  strokeDasharray="4 6"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </g>
            );
          })}

          {/* Menggambar node */}
          {treeNodes.map((node) => {
            let bgColor = "bg-slate-800 border-slate-700 text-slate-300";
            let textColor = "text-slate-200";
            if (node.type === "input") {
              bgColor = "bg-indigo-950/80 border-indigo-500/50 text-indigo-200";
            } else if (node.type === "error") {
              bgColor = "bg-amber-950/60 border-amber-500/50 text-amber-300";
            } else if (node.type === "success") {
              bgColor = "bg-emerald-950/60 border-emerald-500/50 text-emerald-300";
            }

            return (
              <g key={node.id}>
                {/* Node Box */}
                <foreignObject
                  x={node.x - 70}
                  y={node.y - 22}
                  width="140"
                  height="44"
                >
                  <div
                    className={`flex items-center justify-center text-center px-2 py-1.5 rounded-xl border text-[11px] font-medium leading-tight shadow-lg h-full ${bgColor}`}
                  >
                    {node.label}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Widget Analitik Bawah */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Akurasi Decision Tree</span>
          </div>
          <p className="text-xl font-bold text-slate-100">98.4%</p>
          <p className="text-[10px] text-slate-500">Berdasarkan data jadwal historis</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Total Terproses</span>
          </div>
          <p className="text-xl font-bold text-slate-100">120+ Jam</p>
          <p className="text-[10px] text-slate-500">Slot jadwal berhasil dianalisis</p>
        </div>
      </div>
    </div>
  );
}
