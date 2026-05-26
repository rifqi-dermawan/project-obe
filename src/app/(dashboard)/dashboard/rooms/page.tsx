"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getRooms,
  addRoom,
  deleteRoom,
  RoomData,
} from "@/app/actions/roomActions";
import RoomForm from "@/components/RoomForm";
import RoomTable from "@/components/RoomTable";
import RoomCards from "@/components/RoomCards";
import RoomQrModal from "@/components/RoomQrModal";

export default function RoomsPage() {
  const [roomsList, setRoomsList] = useState<RoomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQrRoom, setSelectedQrRoom] = useState<RoomData | null>(null);

  const laboratoriumList = roomsList.filter((r) => r.type === "LAB");
  const ruanganKelasList = roomsList.filter((r) => r.type === "KELAS");

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    facilities: "",
  });

  const getStudentUrl = (roomName: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/jadwal?ruangan=${encodeURIComponent(roomName)}`;
    }
    return `/jadwal?ruangan=${encodeURIComponent(roomName)}`;
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const data = await getRooms();
    setRoomsList(data);
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

  const handleAddRuangan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity) return;

    setIsSubmitting(true);

    await addRoom({
      name: formData.name,
      capacity: parseInt(formData.capacity) || 0,
      facilities: formData.facilities || "-",
      status: "Tersedia",
    });

    await fetchData();
    setFormData({ name: "", capacity: "", facilities: "" });
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    await deleteRoom(id);
    await fetchData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Manajemen Ruangan &amp; Lab
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm sm:text-base">
            Kelola data fasilitas ruangan dan kapasitas lab.
          </p>
        </div>
      </div>

      <RoomForm
        formData={formData}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
        onSubmit={handleAddRuangan}
      />

      <div className="hidden md:block space-y-8">
        <RoomTable
          title="Laboratorium"
          icon="🔬"
          roomsList={laboratoriumList}
          isLoading={isLoading}
          onSelectQr={setSelectedQrRoom}
          onDelete={handleDelete}
          nameColorClass="text-indigo-600 dark:text-indigo-400"
        />

        <RoomTable
          title="Ruangan Kelas"
          icon="🏫"
          roomsList={ruanganKelasList}
          isLoading={isLoading}
          onSelectQr={setSelectedQrRoom}
          onDelete={handleDelete}
          nameColorClass="text-slate-800 dark:text-zinc-200"
        />
      </div>

      <RoomCards
        laboratoriumList={laboratoriumList}
        ruanganKelasList={ruanganKelasList}
        isLoading={isLoading}
        onSelectQr={setSelectedQrRoom}
        onDelete={handleDelete}
      />

      <RoomQrModal
        selectedQrRoom={selectedQrRoom}
        onClose={() => setSelectedQrRoom(null)}
        getStudentUrl={getStudentUrl}
      />
    </div>
  );
}
