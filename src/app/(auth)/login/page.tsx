"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  QrCode,
  Eye,
  EyeOff,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
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
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden z-10"
      >
        <div className="p-8 sm:p-10">
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <QrCode className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-center text-slate-900 dark:text-white mb-2 tracking-tight">
            Halaman Login Administrator
          </h1>
          <p className="text-center text-sm text-slate-500 dark:text-zinc-400 mb-6 font-medium">
            Manajemen Jadwal Informatika
          </p>

          {errorAlert && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30">
              {errorAlert}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300 ml-1">
                Masukkan Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@informatika.ac.id"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:text-white placeholder:text-slate-400"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300 ml-1">
                Masukkan Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>

                {/* Tipe input bergantung pada state showPassword */}
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:text-white placeholder:text-slate-400"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={isLoading}
                />

                {/* Tombol Mata (Toggle) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengautentikasi...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-950/50 p-5 border-t border-slate-100 dark:border-white/5 text-center flex flex-col items-center gap-2">
          <p className="text-xs text-slate-500 dark:text-zinc-500">
            Halaman ini khusus untuk Administrator.
          </p>
          <Link href="/jadwal" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline">
            Portal Jadwal Publik Mahasiswa &rarr;
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
