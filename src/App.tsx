import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Calendar, User, Bell, Search, Filter, Info, CheckCircle, XCircle 
} from 'lucide-react';
import BookingModal from './components/BookingModal';
import DetailModal from './components/DetailModal';

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [dataToEdit, setDataToEdit] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const API_URL = 'http://localhost:5148/api/booking';

  const fetchBookings = async () => {
    try {
      const res = await axios.get(API_URL);
      setBookings(res.data);
    } catch (err) { console.error("Gagal load data", err); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
  try {
    // Tambahkan /status di akhir URL
    await axios.put(`${API_URL}/${id}/status`, `"${newStatus}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
    fetchBookings();
  } catch (err) {
    alert("Gagal update status");
  }
};

  const handleDelete = async (id: number) => {
    if (window.confirm("Hapus data ini?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchBookings();
      } catch (err) { alert("Gagal hapus"); }
    }
  };

  const handleOpenEdit = (booking: any) => {
    setDataToEdit(booking);
    setIsDetailOpen(false);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setDataToEdit(null);
  };

  const filteredBookings = bookings
    .filter((b: any) => 
      b.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => {
      if (sortBy === 'latest') return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      if (sortBy === 'room') return a.roomName.localeCompare(b.roomName);
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* NAVBAR */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-5xl">
        <div className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl text-indigo-600">
            <Calendar size={20} /> <span>RoomSync</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="text-slate-400" size={20} />
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><User size={20} /></div>
          </div>
        </div>
      </nav>

      <main className="pt-32 px-6 max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black italic">Dashboard</h1>
            <p className="text-slate-500">Kelola peminjaman ruangan Anda di sini.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-100">
            <Plus size={20} /> Buat Peminjaman
          </button>
        </header>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input type="text" placeholder="Cari..." className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500" 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="bg-white border border-slate-100 px-4 py-3 rounded-2xl font-bold text-sm outline-none"
            value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="latest">Terbaru</option>
            <option value="room">Nama Ruang</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Ruangan</th>
                <th className="px-6 py-5">Peminjam</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-800">{b.roomName}</td>
                  <td className="px-6 py-5 font-semibold text-slate-600">{b.userName}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${
                      b.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : 
                      b.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>{b.status}</span>
                  </td>
                  <td className="px-6 py-5 flex justify-end gap-2">
                    <button onClick={() => handleUpdateStatus(b.id, 'Approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle size={18}/></button>
                    <button onClick={() => handleUpdateStatus(b.id, 'Rejected')} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"><XCircle size={18}/></button>
                    <button onClick={() => { setSelectedBooking(b); setIsDetailOpen(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Info size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <BookingModal isOpen={isModalOpen} onClose={handleCloseForm} onSuccess={fetchBookings} editData={dataToEdit} />
      
      <DetailModal 
        isOpen={isDetailOpen} 
        booking={selectedBooking} 
        onClose={() => setIsDetailOpen(false)} 
        onDelete={handleDelete}
        onEdit={handleOpenEdit} 
      />
    </div>
  );
}