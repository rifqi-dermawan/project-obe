"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCircuit, Loader2, Eye, EyeOff, CalendarRange } from "lucide-react";
import Link from "next/link";
import DecisionTreePreview from "@/components/DecisionTreePreview";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Jika sudah login, redirect ke dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  // Tampilkan loading spinner saat mengecek session
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-800 dark:text-zinc-200" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(false);
    setErrorAlert("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      setErrorAlert(result.error);
      setIsLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Panel Kiri - Hanya tampil di desktop (lg ke atas) */}
      <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-screen sticky top-0 overflow-hidden">
        <DecisionTreePreview />
      </div>

      {/* Panel Kanan - Formulir Login */}
      <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 bg-white dark:bg-zinc-900/50 backdrop-blur-md border-l border-slate-200/50 dark:border-zinc-800/40 shadow-2xl min-h-screen">
        <div className="w-full max-w-[400px] space-y-8">
          
          {/* Logo & Judul */}
          <div className="space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Selamat Datang
              </h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Silakan masuk untuk mengelola dan menganalisis jadwal Informatika.
              </p>
            </div>
          </div>

          {/* Alert Error */}
          {errorAlert && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/20">
              {errorAlert}
            </div>
          )}

          {/* Form Utama */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-semibold text-xs text-slate-700 dark:text-zinc-300 ml-0.5"
              >
                Alamat Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="admin@informatika.ac.id"
                disabled={isLoading}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-12 px-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-0.5">
                <Label
                  htmlFor="password"
                  className="font-semibold text-xs text-slate-700 dark:text-zinc-300"
                >
                  Kata Sandi
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium hover:underline transition-colors"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="h-12 pl-4 pr-12 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Sign In */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 rounded-xl font-bold bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all active:scale-[0.99] border-0 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengautentikasi...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </form>

          {/* Pembatas / Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-3 font-semibold text-slate-400 dark:text-zinc-500">
                Atau masuk sebagai publik
              </span>
            </div>
          </div>

          {/* Portal Publik */}
          <Link href="/jadwal" className="block w-full">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl font-bold border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-300 transition-all flex items-center justify-center gap-2"
            >
              <CalendarRange className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
              Lihat Jadwal Kuliah (Publik)
            </Button>
          </Link>

          {/* Footer */}
          <div className="text-center text-xs text-slate-400 dark:text-zinc-500 pt-4">
            <p>Universitas Pancasakti Tegal © 2026</p>
          </div>

        </div>
      </div>
    </div>
  );
}
