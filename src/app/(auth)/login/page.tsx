"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCircuit, Eye, EyeOff, Moon, Sun } from "lucide-react";
import Link from "next/link";
import SciFiBackground from "@/components/sci-fi-background";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mencegah hydration mismatch error
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    // Cleanup function
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-black p-4 font-sans transition-colors duration-500">
      {/* Background (Otomatis menyesuaikan tema) */}
      <SciFiBackground />

      {/* Tombol Pengganti Tema (Pojok Kanan Atas) */}
      {mounted && (
        <div className="absolute top-6 right-6 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200 dark:border-zinc-800 shadow-sm transition-all"
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700" />
            )}
          </Button>
        </div>
      )}

      {/* Container Login Tengah */}
      <div className="relative z-10 w-full max-w-[440px] rounded-3xl bg-white/90 dark:bg-zinc-950/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl backdrop-blur-xl border border-slate-200 dark:border-white/10 transition-colors duration-500">
        {/* Header Title & Logo */}
        <div className="mb-8 flex flex-col items-center space-y-3 text-center">
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 p-3.5 shadow-sm">
            <BrainCircuit className="h-8 w-8 text-slate-800 dark:text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              DT-Scheduling
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Analisis Jadwal Kelas Informatika
            </p>
          </div>
        </div>

        <div className="space-y-5 mb-4">
          <div className="space-y-2.5">
            <Label
              htmlFor="email"
              className="font-semibold text-sm text-slate-700 dark:text-zinc-300"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="mahasiswa@upstegal.ac.id"
              className="h-12 rounded-xl bg-white dark:bg-zinc-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 border-slate-200 dark:border-white/10 focus:border-slate-400 dark:focus:border-zinc-500 transition-colors shadow-sm"
            />
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="password"
              className="font-semibold text-sm text-slate-700 dark:text-zinc-300"
            >
              Password
            </Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="h-12 rounded-xl bg-white dark:bg-zinc-900/50 text-slate-900 dark:text-white border-slate-200 dark:border-white/10 focus:border-slate-400 dark:focus:border-zinc-500 transition-colors shadow-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white hover:underline transition-colors"
          >
            Lupa Password?
          </Link>
        </div>

        <Button className="w-full h-12 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-black transition-all hover:bg-slate-800 dark:hover:bg-zinc-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 border-0 mb-6">
          Masuk Ke Dashboard
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-[#09090b] px-3 font-semibold text-slate-400 dark:text-zinc-500 rounded-full border border-slate-200 dark:border-white/5 transition-colors duration-500">
              Atau login dengan
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full font-medium h-12 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white border-slate-200 dark:border-white/10 transition-all shadow-sm"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full font-medium h-12 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white border-slate-200 dark:border-white/10 transition-all shadow-sm"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            Microsoft
          </Button>
        </div>

        <p className="px-8 mt-8 text-center text-xs text-slate-500 dark:text-zinc-600 transition-colors duration-500">
          Universitas Pancasakti Tegal © 2026
        </p>
      </div>
    </div>
  );
}
