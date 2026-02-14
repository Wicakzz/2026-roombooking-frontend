import { X, Users, Calendar, Clock, MapPin, Info, Save, Edit2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  isOpen: boolean;
  room: any;
  bookings: any[];
  onClose: () => void;
  onRefresh: () => void;
  onEditBooking: (booking: any) => void;
}

export default function RoomDetailModal({ isOpen, room, bookings, onClose, onRefresh, onEditBooking }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ capacity: 0, status: '' });

  // Sinkronisasi data saat modal dibuka
  useEffect(() => {
    if (room && isOpen) {
      setEditData({ capacity: room.capacity, status: room.status });
      setIsEditing(false);
    }
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

  const handleUpdate = async () => {
    try {
      const dataToSend = { ...room, ...editData };
      await axios.put(`http://localhost:5148/api/room/${room.id}`, dataToSend);
      onRefresh(); 
      setIsEditing(false);
      alert("Ruangan berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal update ruangan", err);
      alert("Gagal menyimpan perubahan.");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="flex flex-col md:flex-row min-h-[550px]">
          
          {/* SISI KIRI: DETAIL & EDIT FORM */}
          <div className="w-full md:w-1/2 bg-slate-50 p-10 border-r border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.15em]">
                  {isEditing ? 'Mode Edit Fasilitas' : 'Informasi Ruangan'}
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2.5 rounded-xl transition-all ${isEditing ? 'bg-amber-100 text-amber-600 rotate-90' : 'bg-white shadow-sm text-slate-400 hover:text-indigo-600'}`}
                >
                  {isEditing ? <X size={18}/> : <Edit2 size={18}/>}
                </button>
              </div>

              <h2 className="text-3xl font-black text-slate-800 mb-2 leading-tight tracking-tight">{room.name}</h2>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-10">
                <MapPin size={16} className="text-indigo-400"/> {room.location}
              </div>

              <div className="space-y-8">
                {/* INPUT KAPASITAS */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Kapasitas Maksimal</label>
                  {isEditing ? (
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20}/>
                      <input 
                        type="number"
                        value={editData.capacity}
                        onChange={(e) => setEditData({...editData, capacity: parseInt(e.target.value)})}
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl p-4 pl-12 font-black text-xl text-indigo-600 focus:border-indigo-500 outline-none transition-all shadow-inner"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-2xl font-black text-slate-700">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-500"><Users size={22}/></div>
                      <span>{room.capacity} <span className="text-sm font-bold text-slate-400 ml-1 uppercase">Orang</span></span>
                    </div>
                  )}
                </div>

                {/* STATUS CARDS SELECTOR */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Status Kondisi</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      disabled={!isEditing}
                      onClick={() => setEditData({...editData, status: 'Available'})}
                      className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${
                        editData.status?.toLowerCase() === 'available' 
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-100' 
                          : 'border-white bg-white text-slate-300 opacity-60'
                      } ${isEditing ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'}`}
                    >
                      <CheckCircle2 size={24}/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Available</span>
                    </button>

                    <button
                      disabled={!isEditing}
                      onClick={() => setEditData({...editData, status: 'Maintenance'})}
                      className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${
                        editData.status?.toLowerCase() === 'maintenance' 
                          ? 'border-red-500 bg-red-50 text-red-700 shadow-lg shadow-red-100' 
                          : 'border-white bg-white text-slate-300 opacity-60'
                      } ${isEditing ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'}`}
                    >
                      <AlertCircle size={24}/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Maintenance</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <button 
                onClick={handleUpdate}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save size={20}/> SIMPAN PERUBAHAN
              </button>
            )}
          </div>

          {/* SISI KANAN: LIST JADWAL BOOKING */}
          <div className="w-full md:w-1/2 p-10 flex flex-col bg-white">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-black text-slate-800 text-xl tracking-tight leading-none">Jadwal Agenda</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Klik jadwal untuk detail</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={24} className="text-slate-300"/></button>
            </div>
            
            <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {bookings && bookings.length > 0 ? bookings.map((b: any) => (
                <div 
                  key={b.id} 
                  onClick={() => onEditBooking(b)}
                  className="p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{b.userName}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-black uppercase">
                          <Calendar size={12} className="text-indigo-500"/>
                          {new Date(b.startTime).toLocaleDateString('id-ID')}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-black uppercase">
                          <Clock size={12} className="text-indigo-500"/>
                          {new Date(b.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Calendar size={32} className="text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold text-sm tracking-tight">Tidak ada jadwal aktif.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}