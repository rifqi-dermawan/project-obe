"use client";

import { useState, useEffect, useCallback } from "react";
import UploadScheduleModal, {
  JadwalHasilAI,
} from "@/components/UploadScheduleModal";
import EditScheduleModal from "@/components/EditScheduleModal";
import { toast } from "sonner";
import {
  getJadwal,
  addJadwal,
  deleteJadwal,
  updateJadwal,
  JadwalData,
} from "@/app/actions/scheduleActions";

import AutoSmoothScroll from "@/components/AutoSmoothScroll";
import ScheduleForm from "@/components/ScheduleForm";
import ScheduleTable from "@/components/ScheduleTable";
import ScheduleCards from "@/components/ScheduleCards";

export default function SchedulePage() {
  const [jadwalList, setJadwalList] = useState<JadwalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalData | null>(null);

  const [formData, setFormData] = useState({
    subject: "",
    class: "",
    lecturer: "",
    room: "",
    time: "",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const data = await getJadwal();
    setJadwalList(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAddJadwal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.subject ||
      !formData.class ||
      !formData.lecturer ||
      !formData.room ||
      !formData.time
    )
      return;

    setIsSubmitting(true);
    const isBentrok = jadwalList.some(
      (j) => j.room === formData.room && j.time === formData.time,
    );
    const calculatedStatus = isBentrok ? "Bentrok" : "Aman";

    const result = await addJadwal({ ...formData, status: calculatedStatus });
    await fetchData();

    if (result.success) {
      toast.success("Jadwal Baru Ditambahkan", {
        description: `${formData.subject} (${formData.class}) berhasil disimpan.`,
      });
      setFormData({
        subject: "",
        class: "",
        lecturer: "",
        room: "",
        time: "",
      });
    } else {
      toast.error("Gagal Menyimpan", {
        description: "Terjadi kesalahan saat menghubungi database.",
      });
    }

    setIsSubmitting(false);
  };

  const handleAIUploadSuccess = async (dataFromAI: JadwalHasilAI[]) => {
    setIsSubmitting(true);
    try {
      for (const item of dataFromAI) {
        const waktuFormatted = `${item.day}, ${item.startTime} - ${item.endTime}`;
        const isBentrok = jadwalList.some(
          (j) => j.room === item.room && j.time === waktuFormatted,
        );
        const calculatedStatus = isBentrok ? "Bentrok" : "Aman";

        await addJadwal({
          subject: item.subject,
          class: item.class || "-",
          lecturer: item.lecturer,
          room: item.room,
          time: waktuFormatted,
          status: calculatedStatus,
        });
      }
      await fetchData();
      toast.success("Analisis AI Berhasil!", {
        description: `${dataFromAI.length} jadwal otomatis ditambahkan dari dokumen.`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal Memproses Data AI", {
        description: "Terjadi kesalahan saat menyimpan ke database.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteJadwal(id);
    await fetchData();
    if (result.success) {
      toast.info("Jadwal Dihapus", {
        description: "Data jadwal telah dihapus dari sistem.",
      });
    }
  };

  const handleOpenEdit = (jadwal: JadwalData) => {
    setSelectedJadwal(jadwal);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (
    id: number,
    updatedData: Omit<JadwalData, "id">,
  ) => {
    const isBentrok = jadwalList.some(
      (j) =>
        j.id !== id &&
        j.room === updatedData.room &&
        j.time === updatedData.time,
    );
    const calculatedStatus = isBentrok ? "Bentrok" : "Aman";

    const result = await updateJadwal(id, {
      ...updatedData,
      status: calculatedStatus,
    });
    await fetchData();

    if (result.success) {
      toast.success("Perubahan Disimpan", {
        description: "Jadwal berhasil diperbarui.",
      });
    }
  };

  return (
    <AutoSmoothScroll className="space-y-8 relative">
      <div className="space-y-8 animate-in fade-in duration-700 relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manajemen Penjadwalan
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm sm:text-base">
              Kelola dan analisis jadwal kelas &amp; lab
            </p>
          </div>
        </div>

        <ScheduleForm
          formData={formData}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSubmit={handleAddJadwal}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />

        <ScheduleTable
          jadwalList={jadwalList}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        <ScheduleCards
          jadwalList={jadwalList}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        <UploadScheduleModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleAIUploadSuccess}
        />
        <EditScheduleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          jadwal={selectedJadwal}
          onSave={handleSaveEdit}
        />
      </div>
    </AutoSmoothScroll>
  );
}