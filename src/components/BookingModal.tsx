import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: any; 
}

export default function BookingModal({ isOpen, onClose, onSuccess, editData }: Props) {
  const [form, setForm] = useState({ 
    RoomName: '', 
    UserName: '', 
    StartTime: '', 
    EndTime: '',
    Status: 'Pending' 
  });

  // Sinkronisasi data saat modal dibuka atau saat mode berubah (tambah/edit)
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setForm({
          RoomName: editData.roomName || '',
          UserName: editData.userName || '',
          StartTime: editData.startTime ? editData.startTime.substring(0, 16) : '', // Format untuk input datetime-local
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
  try {
    const url = 'http://localhost:5148/api/booking';
    
    // Kita paksa format tanggal ke standar ISO agar C# tidak bingung
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
    // Intip pesan error spesifik dari C# di tab Network jika ini masih gagal
    console.error("Detail Error:", err.response?.data?.errors);
    alert("Gagal memproses data! Periksa kembali format input.");
  }
};

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">
            {editData ? 'Edit Peminjaman' : 'Buat Peminjaman Baru'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 ml-1">Nama Ruangan</label>
            <input required type="text" className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
              value={form.RoomName} onChange={e => setForm({...form, RoomName: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 ml-1">Nama Lengkap</label>
            <input required type="text" className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.UserName} onChange={e => setForm({...form, UserName: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 ml-1">Mulai</label>
              <input required type="datetime-local" className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 outline-none"
                value={form.StartTime} onChange={e => setForm({...form, StartTime: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 ml-1">Selesai</label>
              <input required type="datetime-local" className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 outline-none"
                value={form.EndTime} onChange={e => setForm({...form, EndTime: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl mt-4 hover:bg-indigo-700 shadow-lg transition-all active:scale-[0.98]">
            {editData ? 'Simpan Perubahan' : 'Kirim Permohonan'}
          </button>
        </form>
      </div>
    </div>
  );
}