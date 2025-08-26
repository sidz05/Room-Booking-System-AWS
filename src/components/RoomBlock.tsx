import React, { useState } from 'react';
import { Room } from '../types/booking';
import { Users, Monitor, Wifi, Camera, Printer, Wrench } from 'lucide-react';

interface RoomBlockProps {
  room: Room;
  isBooked: boolean;
  onRoomClick: (roomId: string) => void;
  bookingDetails?: any;
}

export default function RoomBlock({ room, isBooked, onRoomClick, bookingDetails }: RoomBlockProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTypeColor = (type: Room['type']) => {
    switch (type) {
      case 'lab': return 'bg-blue-50 border-blue-200';
      case 'classroom': return 'bg-green-50 border-green-200';
      case 'office': return 'bg-purple-50 border-purple-200';
      case 'meeting': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: Room['type']) => {
    switch (type) {
      case 'lab': return <Monitor className="w-4 h-4" />;
      case 'classroom': return <Users className="w-4 h-4" />;
      case 'office': return <Printer className="w-4 h-4" />;
      case 'meeting': return <Camera className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  const getEquipmentIcon = (equipment: string) => {
    if (equipment.toLowerCase().includes('computer') || equipment.toLowerCase().includes('workstation')) {
      return <Monitor className="w-3 h-3" />;
    }
    if (equipment.toLowerCase().includes('network') || equipment.toLowerCase().includes('wifi')) {
      return <Wifi className="w-3 h-3" />;
    }
    if (equipment.toLowerCase().includes('printer') || equipment.toLowerCase().includes('scanner')) {
      return <Printer className="w-3 h-3" />;
    }
    if (equipment.toLowerCase().includes('video') || equipment.toLowerCase().includes('camera')) {
      return <Camera className="w-3 h-3" />;
    }
    return <Wrench className="w-3 h-3" />;
  };

  return (
    <div
      className="relative"
      style={{
        gridRow: `${room.gridPosition.row} / span ${room.gridPosition.height}`,
        gridColumn: `${room.gridPosition.col} / span ${room.gridPosition.width}`
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={() => onRoomClick(room.id)}
        className={`
          w-full h-full min-h-[80px] p-3 rounded-lg border-2 transition-all duration-300
          ${isBooked 
            ? 'border-red-500 bg-red-50 shadow-lg scale-105' 
            : `${getTypeColor(room.type)} hover:shadow-md hover:scale-105 active:scale-95`
          }
          flex flex-col items-center justify-center text-center
          group relative overflow-hidden
        `}
      >
        <div className="flex items-center space-x-2 mb-1">
          <div className={`${isBooked ? 'text-red-600' : 'text-gray-600'}`}>
            {getTypeIcon(room.type)}
          </div>
          <span className={`font-semibold text-sm ${isBooked ? 'text-red-800' : 'text-gray-800'}`}>
            {room.name}
          </span>
        </div>
        
        <div className={`text-xs ${isBooked ? 'text-red-600' : 'text-gray-500'} flex items-center space-x-1`}>
          <Users className="w-3 h-3" />
          <span>{room.capacity}</span>
        </div>

        {isBooked && (
          <div className="absolute inset-0 bg-red-500 bg-opacity-10 flex items-center justify-center">
            <div className="text-center">
              <span className="text-red-600 font-bold text-xs bg-white px-2 py-1 rounded shadow block mb-1">
                BOOKED
              </span>
              {bookingDetails && typeof bookingDetails === 'object' && (
                <span className="text-red-600 text-xs bg-white px-1 py-0.5 rounded shadow">
                  {bookingDetails.startTime} - {bookingDetails.endTime}
                </span>
              )}
            </div>
          </div>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{room.name}</h4>
              <span className="bg-gray-700 px-2 py-1 rounded text-xs capitalize">
                {room.type}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mb-2">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>Capacity: {room.capacity}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-medium">Equipment:</p>
              <div className="grid grid-cols-2 gap-1">
                {room.equipment.slice(0, 4).map((eq, index) => (
                  <div key={index} className="flex items-center space-x-1 text-gray-300">
                    {getEquipmentIcon(eq)}
                    <span className="truncate">{eq}</span>
                  </div>
                ))}
              </div>
              {room.equipment.length > 4 && (
                <p className="text-gray-400 text-xs">+{room.equipment.length - 4} more</p>
              )}
            </div>

            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}