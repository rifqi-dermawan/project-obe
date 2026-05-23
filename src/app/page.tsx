import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import SciFiBackground from "@/components/sci-fi-background";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 font-sans text-slate-900">
      {/* Background Terang Clean */}
      <SciFiBackground />

      {/* Container Login Tengah (White Glassmorphism) */}
      <div className="relative z-10 w-full max-w-[440px] rounded-3xl bg-white/80 sm:p-8 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl border border-slate-200/60">
        {/* Header Title & Logo */}
        <div className="mb-8 flex flex-col items-center space-y-3 text-center">
          <div className="rounded-2xl bg-white border border-slate-200 p-3.5 shadow-sm">
            <BrainCircuit className="h-8 w-8 text-slate-800" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 heading">
              DT-Scheduling
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Analisis Jadwal Kelas Informatika
            </p>
          </div>
        </div>

        {/* Form Input Biasa (Dipindah ke atas) */}
        <div className="space-y-5 mb-6">
          <div className="space-y-2.5">
            <Label
              htmlFor="email"
              className="font-semibold text-sm text-slate-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="mahasiswa@upstegal.ac.id"
              className="h-12 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-slate-400 focus:ring-slate-400 transition-colors shadow-sm"
            />
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="font-semibold text-sm text-slate-700"
              >
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
              >
                Lupa Password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              className="h-12 rounded-xl bg-white text-slate-900 border-slate-200 focus:border-slate-400 focus:ring-slate-400 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Tombol Submit Utama (Dipindah ke atas) */}
        <Button className="w-full h-12 rounded-xl font-bold bg-slate-900 text-white transition-all hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 border-0 mb-6">
          Masuk Ke Dashboard
        </Button>

        {/* Divider (Teks disesuaikan) */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 font-semibold text-slate-400 rounded-full border border-slate-200">
              Atau lanjutkan dengan
            </span>
          </div>
        </div>

        {/* Tombol SSO (Dipindah ke bawah) */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full font-medium h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border-slate-200 transition-all shadow-sm"
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
            className="w-full font-medium h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border-slate-200 transition-all shadow-sm"
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

        <p className="px-8 mt-8 text-center text-xs text-slate-500">
          Universitas Pancasakti Tegal © 2026
        </p>
      </div>
    </div>
  );
}
