import { useState, useEffect } from 'react';
import { X, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: any;
}

export default function BookingModal({ isOpen, onClose, onSuccess, editData }: Props) {
  const [rooms, setRooms] = useState([]); // State untuk menampung daftar ruangan
  const [form, setForm] = useState({ 
    RoomName: '', 
    UserName: '', 
    StartTime: '', 
    EndTime: '',
    Status: 'Pending' 
  });

  // 1. Ambil data ruangan saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const fetchRooms = async () => {
        try {
          const res = await axios.get('http://localhost:5148/api/room');
          setRooms(res.data);
        } catch (err) {
          console.error("Gagal mengambil data ruangan:", err);
        }
      };
      fetchRooms();

      if (editData) {
        setForm({
          RoomName: editData.roomName || '',
          UserName: editData.userName || '',
          StartTime: editData.startTime ? editData.startTime.substring(0, 16) : '',
          EndTime: editData.endTime ? editData.endTime.substring(0, 16) : '',
          Status: editData.status || 'Pending'
        });
      } else {
        setForm({ RoomName: '', UserName: '', StartTime: '', EndTime: '', Status: 'Pending' });
      }
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.RoomName) return alert("Silakan pilih ruangan terlebih dahulu!");

    try {
      const url = 'http://localhost:5148/api/booking';
      const payload = {
        Id: editData ? editData.id : 0,
        RoomName: form.RoomName,
        UserName: form.UserName,
        StartTime: new Date(form.StartTime).toISOString(),
        EndTime: new Date(form.EndTime).toISOString(),
        Status: form.Status
      };

      if (editData) {
        await axios.put(`${url}/${editData.id}`, payload);
      } else {
        await axios.post(url, payload);
      }

      onSuccess(); 
      onClose();   
    } catch (err: any) {
      console.error("Detail Error:", err.response?.data?.errors);
      alert("Gagal memproses data! Periksa kembali format input.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in duration-200 overflow-y-auto max-h-[95vh] custom-scrollbar">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">
            {editData ? 'Edit Peminjaman' : 'Buat Peminjaman Baru'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* INPUT NAMA USER */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Nama Lengkap</label>
            <input required type="text" className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Contoh: John Doe"
              value={form.UserName} onChange={e => setForm({...form, UserName: e.target.value})} />
          </div>

          {/* SELEKSI RUANGAN (CARDS) */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-3">Pilih Ruangan</label>
            <div className="grid grid-cols-2 gap-3">
              {rooms.map((room: any) => {
                const isAvailable = room.status?.toLowerCase() === 'available';
                const isSelected = form.RoomName === room.name;

                return (
                  <button
                    key={room.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setForm({ ...form, RoomName: room.name })}
                    className={`p-4 rounded-2xl border-2 transition-all text-left relative ${
                      !isAvailable 
                        ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' 
                        : isSelected
                          ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50'
                          : 'border-slate-100 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-bold text-sm ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>{room.name}</span>
                      {isSelected ? <CheckCircle2 size={14} className="text-indigo-600" /> : isAvailable ? null : <AlertCircle size={14} className="text-red-400" />}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                      <Users size={12} /> {room.capacity} Orang
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* INPUT WAKTU */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Mulai</label>
              <input required type="datetime-local" className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                value={form.StartTime} onChange={e => setForm({...form, StartTime: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Selesai</label>
              <input required type="datetime-local" className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                value={form.EndTime} onChange={e => setForm({...form, EndTime: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl mt-4 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] uppercase tracking-widest text-sm">
            {editData ? 'Simpan Perubahan' : 'Konfirmasi Peminjaman'}
          </button>
        </form>
      </div>
    </div>
  );
}