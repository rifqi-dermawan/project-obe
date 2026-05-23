"use client";

import { motion } from "framer-motion";

export default function SciFiBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50 dark:bg-black pointer-events-none transition-colors duration-500">
      {/* Grid Pattern (Terang & Gelap) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

      {/* Cahaya Pendaran Utama */}
      <motion.div
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white dark:bg-white/5 blur-[100px] dark:blur-[120px] rounded-full"
      />

      {/* Garis Data (Beams) */}
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: "-100%", opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          delay: 0.5,
        }}
        className="absolute left-[20%] w-[1px] h-64 bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent blur-[1px]"
      />
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: "-100%", opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "linear",
          delay: 2,
        }}
        className="absolute left-[50%] w-[2px] h-48 bg-gradient-to-b from-transparent via-slate-400 dark:via-white/10 to-transparent blur-[1px]"
      />
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: "-100%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute right-[25%] w-[1px] h-80 bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent blur-[1px]"
      />
    </div>
  );
}
