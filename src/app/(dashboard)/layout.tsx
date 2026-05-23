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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

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
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"
          >
            <LogOut className="h-5 w-5" /> Keluar
          </Button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col">
        {/* HEADER / NAVBAR */}
        <header className="h-16 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-colors">
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
            <h2 className="font-bold text-lg hidden md:block">
              Selamat Datang, Admin
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
            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-white/10" />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
