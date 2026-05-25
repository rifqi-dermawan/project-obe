"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  MapPin,
  Users,
  Settings,
  Menu,
  BrainCircuit,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: CalendarDays, label: "Penjadwalan", href: "/dashboard/schedule" },
  { icon: MapPin, label: "Ruangan & Lab", href: "/dashboard/rooms" },
  { icon: Users, label: "Dosen", href: "/dashboard/lecturers" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-black font-sans transition-colors duration-500">
      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-950 transition-colors">
        <div className="p-6 flex items-center gap-3">
          <div className="rounded-xl bg-slate-900 dark:bg-white p-2">
            <BrainCircuit className="h-5 w-5 text-white dark:text-black" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            DT-Scheduling
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 rounded-xl h-11 ${
                  pathname === item.href
                    ? "bg-slate-100 dark:bg-white/10 font-bold"
                    : "text-slate-500 dark:text-zinc-400"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/10">
          {/* Info user di sidebar desktop */}
          {session?.user && (
            <div className="mb-3 px-2 py-2 rounded-xl bg-slate-50 dark:bg-white/5">
              <p className="text-xs font-bold text-slate-700 dark:text-zinc-200 truncate">{session.user.name ?? "Admin"}</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{session.user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"
          >
            <LogOut className="h-5 w-5" /> Keluar
          </Button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col">
        {/* HEADER / NAVBAR */}
        <header className="h-14 sm:h-16 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-3 sm:px-4 lg:px-8 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-4">
            {/* Tombol Menu Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-xl"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 p-0 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-white/10"
              >
                {/* Title tersembunyi untuk aksesibilitas screen reader */}
                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                {/* Isi Menu Mobile sama dengan Sidebar Desktop */}
                <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-white/10">
                  <BrainCircuit className="h-6 w-6" />
                  <span className="font-bold">DT-Scheduling</span>
                </div>
                <nav className="p-4 space-y-2">
                  {menuItems.map((item) => (
                    <Link key={item.href} href={item.href} passHref>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 h-12 rounded-xl ${
                          pathname === item.href
                            ? "bg-slate-100 dark:bg-white/10 font-bold"
                            : "text-slate-500 dark:text-zinc-400"
                        }`}
                      >
                        <item.icon className="h-5 w-5" /> {item.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <h2 className="font-bold text-base lg:text-lg hidden sm:block">
              Selamat Datang, {session?.user?.name?.split(" ")[0] ?? "Admin"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* THEME TOGGLE */}
            {mounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-xl border-slate-200 dark:border-white/10 transition-all"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </Button>
            )}
            {/* Avatar & logout di header (mobile) */}
            <button
              onClick={handleLogout}
              title="Keluar"
              className="h-8 w-8 sm:h-9 sm:w-9 cursor-pointer rounded-full bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 hover:border-red-200 transition-all"
            >
              {session?.user?.name?.[0]?.toUpperCase() ?? "A"}
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-3 sm:p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
