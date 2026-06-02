"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2, Building2, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import {
  getSettings,
  updateSettings,
} from "@/app/actions/settingsActions";

export default function SettingsPage() {
  const { setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    institutionName: "",
    academicYear: "",
    semester: "",
    emailNotification: true,
    appTheme: "system",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const data = await getSettings();
    if (data) {
      setFormData({
        institutionName: data.institutionName,
        academicYear: data.academicYear,
        semester: data.semester,
        emailNotification: data.emailNotification,
        appTheme: data.appTheme,
      });
      // Set the actual next-themes theme based on saved settings
      if (data.appTheme !== "system") {
        setTheme(data.appTheme);
      }
    }
    setIsLoading(false);
  }, [setTheme]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, emailNotification: checked });
  };



  const handleSave = async () => {
    setIsSaving(true);
    await updateSettings(formData);
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pengaturan</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm sm:text-base">
            Sesuaikan preferensi sistem dan profil aplikasi.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto h-11 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all px-8"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* INSTITUSI */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">Profil Akademik</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="institutionName">Nama Institusi</Label>
              <Input
                id="institutionName"
                value={formData.institutionName}
                onChange={handleInputChange}
                className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academicYear">Tahun Akademik</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
                className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="h-11 rounded-xl dark:bg-zinc-950 dark:border-white/10"
              />
            </div>
          </div>
        </div>

        {/* NOTIFIKASI */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Notifikasi Email</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Terima email otomatis saat ada bentrok jadwal terdeteksi.
              </p>
            </div>
          </div>
          <Switch
            checked={formData.emailNotification}
            onCheckedChange={handleSwitchChange}
          />
        </div>
      </div>
    </div>
  );
}
