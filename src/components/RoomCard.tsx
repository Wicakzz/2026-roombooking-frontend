import { Users, MapPin } from 'lucide-react';

interface RoomProps {
  room: any;
  onClick: (room: any) => void;
}

export default function RoomCard({ room, onClick }: RoomProps) {
  const isAvailable = room.status === 'Available';

  return (
    <div 
      onClick={() => onClick(room)}
      className="bg-white p-5 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        {/* Status Dot */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
            {room.status}
          </span>
        </div>
        
        {/* Kapasitas mungil di pojok */}
        <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px]">
          <Users size={12} />
          <span>{room.capacity}</span>
        </div>
      </div>
      
      {/* Nama Ruang */}
      <h4 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors mb-1">
        {room.name}
      </h4>
      
      {/* Lokasi */}
      <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs">
        <MapPin size={12} />
        <span>{room.location}</span>
      </div>
    </div>
  );
}