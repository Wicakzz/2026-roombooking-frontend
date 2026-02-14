import { X, Trash2, Edit, Calendar, User, MapPin, Tag } from "lucide-react";

interface Props {
  isOpen: boolean;
  booking: any;
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (booking: any) => void; // Fungsi baru untuk trigger edit
}

export default function DetailModal({
  isOpen,
  booking,
  onClose,
  onDelete,
  onEdit,
}: Props) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-extrabold text-slate-800">
            Info Peminjaman
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 mb-8">
          {/* Item Detail */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Ruangan
              </p>
              <p className="text-lg font-bold text-slate-800">
                {booking.roomName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <User size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Peminjam
              </p>
              <p className="text-lg font-bold text-slate-800">
                {booking.userName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Waktu Peminjaman
              </p>
              <p className="text-sm font-bold text-slate-800">
                {new Date(booking.startTime).toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-slate-400">
                s/d {new Date(booking.endTime).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Status
              </p>
              <span
                className={`text-xs font-black uppercase tracking-widest ${
                  booking.status === "Approved"
                    ? "text-green-500"
                    : booking.status === "Rejected"
                      ? "text-red-500"
                      : "text-orange-500"
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons di Bawah Detail */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-6">
          <button
            onClick={() => onEdit(booking)}
            className="flex items-center justify-center gap-2 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-700 transition-all shadow-lg shadow-slate-200"
          >
            <Edit size={18} /> Edit
          </button>
          <button
            onClick={() => {
              onDelete(booking.id);
              onClose();
            }}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"
          >
            <Trash2 size={18} /> Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
