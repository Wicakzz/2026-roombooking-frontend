import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  LayoutDashboard,
  Calendar as Loader2,
  Clock,
  Edit,
  Check,
  XCircle,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import RoomCard from "./components/RoomCard";
import RoomDetailModal from "./components/RoomDetailModal";
import BookingModal from "./components/BookingModal";

export default function App() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isRoomDetailOpen, setIsRoomDetailOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);

  const [isDetailMode, setIsDetailMode] = useState(false);

  const fetchData = async () => {
    try {
      const [resRooms, resBookings] = await Promise.all([
        axios.get("http://localhost:5148/api/room"),
        axios.get("http://localhost:5148/api/booking"),
      ]);
      setRooms(resRooms.data);
      setBookings(resBookings.data.sort((a: any, b: any) => b.id - a.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditBookingFromRoom = (booking: any) => {
    setIsRoomDetailOpen(false);
    setEditingBooking(booking);
    setIsDetailMode(true); // <--- Set ke TRUE untuk mode detail saja
    setTimeout(() => {
      setIsBookingModalOpen(true);
    }, 300);
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  // Fungsi khusus untuk LIHAT DETAIL (isDetailMode = true)
  const handleViewDetail = (booking: any) => {
    setEditingBooking(booking);
    setIsDetailMode(true); // Kunci input
    setIsBookingModalOpen(true);
  };

  // Fungsi khusus untuk EDIT (isDetailMode = false)
  const handleEditFromTable = (booking: any) => {
    setEditingBooking(booking);
    setIsDetailMode(false); // Buka input
    setIsBookingModalOpen(true);
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const booking = bookings.find((b) => b.id === id);
      await axios.put(`http://localhost:5148/api/booking/${id}`, {
        ...booking,
        Status: status,
      });
      fetchData();
    } catch (err) {
      alert("Gagal update status");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* 1. FLOATING NAVBAR DENGAN LOGIKA HIDE SAAT MODAL BUKA */}
      {!isRoomDetailOpen && !isBookingModalOpen && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-100/30 rounded-[2.5rem] px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
                <LayoutDashboard className="text-white" size={22} />
              </div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight italic">
                ROOM<span className="text-indigo-600">MASTER</span>
              </h1>
            </div>

            <div className="flex items-center gap-6">
              {/* 2. BUTTON WARNA INDIGO (SEBELUMNYA HITAM) */}
              <button
                onClick={() => {
                  setEditingBooking(null);
                  setIsBookingModalOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-[1.5rem] font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 active:scale-95"
              >
                <Plus size={20} /> <span className="text-sm">New Booking</span>
              </button>

              <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-800 leading-none">
                    Bagas
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Administrator
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-xl">
                  <User size={24} />
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}

      <main
        className={`max-w-7xl mx-auto px-8 pt-40 transition-all duration-500 ${isRoomDetailOpen || isBookingModalOpen ? "blur-sm scale-[0.98]" : ""}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => {
                setSelectedRoom(room);
                setIsRoomDetailOpen(true);
              }}
            />
          ))}
        </div>

        <section className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h3 className="font-black text-slate-800 text-2xl tracking-tight leading-none">
                  Data Peminjaman
                </h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3 bg-slate-50 inline-block px-3 py-1 rounded-lg">
                  Record Count: {filteredBookings.length}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center bg-slate-50 border border-slate-200 px-4 py-3 rounded-[1.2rem] w-full sm:w-80 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                  <Search size={18} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama atau ruangan..."
                    className="bg-transparent border-none outline-none ml-2 text-sm w-full font-bold text-slate-700 placeholder:text-slate-300"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="flex items-center bg-slate-50 border border-slate-100 p-1.5 rounded-[1.2rem]">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl disabled:opacity-30 transition-all bg-transparent"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-[11px] font-black text-slate-600 px-4 whitespace-nowrap">
                    {currentPage} / {totalPages || 1}
                  </span>
                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl disabled:opacity-30 transition-all bg-transparent"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left bg-slate-50/50">
                  <th className="px-10 py-6">Peminjam</th>
                  <th className="px-10 py-6">Ruangan</th>
                  <th className="px-10 py-6">Waktu Pelaksanaan</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="px-10 py-6">
                      <p className="font-black text-slate-800 text-base leading-none">
                        {b.userName}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold tracking-widest mt-2 uppercase">
                        ID: #{b.id}
                      </p>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {b.roomName}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-indigo-600 flex items-center gap-2">
                          <Clock size={14} />{" "}
                          {new Date(b.startTime).toLocaleString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 mt-1 italic pl-5 tracking-tight">
                          Selesai:{" "}
                          {new Date(b.endTime).toLocaleString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          b.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : b.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {/* 1. TOMBOL APPROVE/REJECT (Hanya muncul jika status PENDING) */}
                        {b.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(b.id, "Approved")
                              }
                              className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm shadow-green-100"
                              title="Approve"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(b.id, "Rejected")
                              }
                              className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}

                        {/* 2. TOMBOL DETAIL (Selalu Muncul untuk semua status) */}
                        <button
                          onClick={() => handleViewDetail(b)}
                          className="p-2.5 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Lihat Detail"
                        >
                          <Search size={18} />
                        </button>

                        {/* 3. TOMBOL EDIT (Hanya muncul jika status PENDING) */}
                        {b.status === "Pending" && (
                          <button
                            onClick={() => handleEditFromTable(b)}
                            className="p-2.5 bg-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm"
                            title="Edit Data"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <RoomDetailModal
        isOpen={isRoomDetailOpen}
        room={selectedRoom}
        onClose={() => setIsRoomDetailOpen(false)}
        onRefresh={fetchData}
        bookings={bookings.filter(
          (b) => b.roomName === selectedRoom?.name && b.status === "Approved",
        )}
        onEditBooking={handleEditBookingFromRoom}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setEditingBooking(null);
          setIsDetailMode(false);
        }}
        onSuccess={fetchData}
        editData={editingBooking}
        isDetailOnly={isDetailMode}
        rooms={rooms}
      />
    </div>
  );
}
