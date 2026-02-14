import { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  Calendar,
  Clock,
  User,
  Home,
  Info,
  AlertCircle,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: any;
  isDetailOnly?: boolean;
  rooms: any[]; // <--- Tambahkan ini
}

export default function BookingModal({
  isOpen,
  onClose,
  onSuccess,
  editData,
  isDetailOnly,
  rooms,
}: Props) {
  // --- STATE FORM ---
  const [formData, setFormData] = useState({
    userName: "",
    roomName: "",
    startTime: "",
    endTime: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);

  // --- SYNC DATA SAAT MODAL DIBUKA ---
  useEffect(() => {
    if (editData) {
      // Jika ada data (Edit/Detail), isi form dengan data tersebut
      setFormData({
        userName: editData.userName || "",
        roomName: editData.roomName || "",
        startTime: editData.startTime
          ? new Date(editData.startTime).toISOString().slice(0, 16)
          : "",
        endTime: editData.endTime
          ? new Date(editData.endTime).toISOString().slice(0, 16)
          : "",
        status: editData.status || "Pending",
      });
    } else {
      // Jika tidak ada data, kosongkan (Mode Tambah Baru)
      setFormData({
        userName: "",
        roomName: "",
        startTime: "",
        endTime: "",
        status: "Pending",
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDetailOnly) return;

    setLoading(true);
    try {
      // Siapkan data dengan format yang disukai Backend C#
      const payload = {
        id: editData?.id || 0, // Sertakan ID jika edit
        userName: formData.userName,
        roomName: formData.roomName,
        // Pastikan format tanggal balik ke format ISO Standard
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        status: formData.status, // Pastikan nama property 'status' sesuai dengan di Backend
      };

      if (editData) {
        // Mode Update - pastikan URL dan Payload sinkron
        await axios.put(
          `http://localhost:5148/api/booking/${editData.id}`,
          payload,
        );
      } else {
        // Mode Create
        await axios.post("http://localhost:5148/api/booking", payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      // Log detail error biar kita tahu bagian mana yang bikin Bad Request
      console.error("Detail Error API:", err.response?.data);
      alert(
        "Gagal: " +
          (err.response?.data?.title || "Cek format data atau koneksi API"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL CONTENT */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              {isDetailOnly
                ? "Detail Peminjaman"
                : editData
                  ? "Edit Booking"
                  : "Booking Baru"}
            </h2>
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1">
              {isDetailOnly
                ? `ID Record: #${editData?.id}`
                : "Lengkapi data peminjaman"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* INPUT NAMA PEMINJAM */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <User size={14} /> Nama Peminjam
            </label>
            <input
              required
              disabled={isDetailOnly}
              className={`w-full px-5 py-4 rounded-2xl border-2 transition-all outline-none font-bold text-slate-700
                ${isDetailOnly ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed" : "bg-white border-slate-100 focus:border-indigo-500"}`}
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
            />
          </div>

          {/* INPUT RUANGAN (Dropdown) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <Home size={14} /> Pilih Ruangan
            </label>
            <select
              required
              disabled={isDetailOnly}
              className={`w-full px-5 py-4 rounded-2xl border-2 transition-all outline-none font-bold text-slate-700 appearance-none
      ${isDetailOnly ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed" : "bg-white border-slate-100 focus:border-indigo-500"}`}
              value={formData.roomName}
              onChange={(e) =>
                setFormData({ ...formData, roomName: e.target.value })
              }
            >
              <option value="" disabled>
                Pilih satu ruangan...
              </option>
              {rooms.map((room) => (
                <option key={room.id} value={room.name}>
                  {room.name} (Kapasitas: {room.capacity})
                </option>
              ))}
            </select>
            {!isDetailOnly && (
              <p className="text-[9px] text-slate-400 ml-1 italic">
                *Pastikan ruangan tersedia pada jam tersebut
              </p>
            )}
          </div>

          {/* INPUT WAKTU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Clock size={14} /> Mulai
              </label>
              <input
                required
                type="datetime-local"
                disabled={isDetailOnly}
                className={`w-full px-5 py-4 rounded-2xl border-2 transition-all outline-none font-bold text-sm text-slate-700
                  ${isDetailOnly ? "bg-slate-50 border-slate-100 text-slate-400" : "bg-white border-slate-100 focus:border-indigo-500"}`}
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Clock size={14} /> Selesai
              </label>
              <input
                required
                type="datetime-local"
                disabled={isDetailOnly}
                className={`w-full px-5 py-4 rounded-2xl border-2 transition-all outline-none font-bold text-sm text-slate-700
                  ${isDetailOnly ? "bg-slate-50 border-slate-100 text-slate-400" : "bg-white border-slate-100 focus:border-indigo-500"}`}
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* STATUS INFO (Hanya muncul jika mode detail/edit) */}
          {editData && (
            <div
              className={`p-4 rounded-2xl flex items-center gap-3 ${formData.status === "Approved" ? "bg-green-50" : "bg-amber-50"}`}
            >
              <Info
                className={
                  formData.status === "Approved"
                    ? "text-green-600"
                    : "text-amber-600"
                }
                size={20}
              />
              <p
                className={`text-xs font-bold uppercase tracking-widest ${formData.status === "Approved" ? "text-green-700" : "text-amber-700"}`}
              >
                Status Saat Ini: {formData.status}
              </p>
            </div>
          )}

          {/* FOOTER BUTTONS */}
          <div className="pt-4">
            {isDetailOnly ? (
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Tutup Detail
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {editData ? "Simpan Perubahan" : "Konfirmasi Booking"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Komponen Loader kecil untuk button
function Loader2({ size, className }: { size: number; className?: string }) {
  return <Clock size={size} className={`animate-spin ${className}`} />;
}
