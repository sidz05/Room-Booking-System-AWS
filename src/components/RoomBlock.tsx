import React, { useState } from 'react';
import { Room } from '../types/booking';
import { Users, Monitor, Wifi, Camera, Printer, Wrench } from 'lucide-react';

interface RoomBlockProps {
  room: Room;
  isBooked: boolean;
  onRoomClick: (roomId: string) => void;
  bookingDetails?: any;
  isPublicView?: boolean;
}

export default function RoomBlock({ room, isBooked, onRoomClick, bookingDetails, isPublicView = false }: RoomBlockProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTypeColor = (type: Room['type']) => {
    switch (type) {
      case 'lab': return isPublicView ? 'bg-blue-500 bg-opacity-20 border-blue-400 border-opacity-50' : 'bg-blue-50 border-blue-200';
      case 'classroom': return isPublicView ? 'bg-green-500 bg-opacity-20 border-green-400 border-opacity-50' : 'bg-green-50 border-green-200';
      case 'office': return isPublicView ? 'bg-purple-500 bg-opacity-20 border-purple-400 border-opacity-50' : 'bg-purple-50 border-purple-200';
      case 'meeting': return isPublicView ? 'bg-orange-500 bg-opacity-20 border-orange-400 border-opacity-50' : 'bg-orange-50 border-orange-200';
      default: return isPublicView ? 'bg-gray-500 bg-opacity-20 border-gray-400 border-opacity-50' : 'bg-gray-50 border-gray-200';
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
        disabled={isPublicView}
        className={`
          w-full h-full min-h-[90px] p-4 rounded-xl border-2 transition-all duration-500 transform
          ${isBooked 
            ? isPublicView 
              ? 'border-red-400 border-opacity-70 bg-red-500 bg-opacity-30 shadow-2xl scale-105 backdrop-blur-sm' 
              : 'border-red-500 bg-red-50 shadow-lg scale-105'
            : `${getTypeColor(room.type)} ${!isPublicView ? 'hover:shadow-xl hover:scale-110 active:scale-95 hover:-translate-y-1' : 'hover:scale-105'} ${isPublicView ? 'backdrop-blur-sm' : ''}`
          }
          flex flex-col items-center justify-center text-center
          group relative overflow-hidden
          ${isPublicView ? 'cursor-default' : 'cursor-pointer'}
          ${isPublicView ? 'shadow-lg hover:shadow-xl' : ''}
        `}
      >
        <div className="flex items-center space-x-2 mb-2">
          <div className={`${isBooked ? (isPublicView ? 'text-red-300' : 'text-red-600') : (isPublicView ? 'text-white text-opacity-80' : 'text-gray-600')} transition-colors duration-300`}>
            {getTypeIcon(room.type)}
          </div>
          <span className={`font-bold text-sm ${isBooked ? (isPublicView ? 'text-red-200' : 'text-red-800') : (isPublicView ? 'text-white' : 'text-gray-800')} transition-colors duration-300`}>
            {room.name}
          </span>
        </div>
        
        <div className={`text-xs ${isBooked ? (isPublicView ? 'text-red-300' : 'text-red-600') : (isPublicView ? 'text-white text-opacity-70' : 'text-gray-500')} flex items-center space-x-1 transition-colors duration-300`}>
          <Users className="w-3 h-3" />
          <span>{room.capacity}</span>
        </div>

        {isBooked && (
          <div className={`absolute inset-0 ${isPublicView ? 'bg-red-500 bg-opacity-20' : 'bg-red-500 bg-opacity-10'} flex items-center justify-center backdrop-blur-sm`}>
            <div className="text-center">
              <span className={`${isPublicView ? 'text-red-200 bg-red-500 bg-opacity-40 border border-red-400 border-opacity-50' : 'text-red-600 bg-white'} font-bold text-xs px-3 py-1 rounded-full shadow-lg block mb-2 backdrop-blur-sm`}>
                BOOKED
              </span>
              {bookingDetails && typeof bookingDetails === 'object' && (
                <div className={`${isPublicView ? 'text-red-200 bg-red-500 bg-opacity-30 border border-red-400 border-opacity-50' : 'text-red-600 bg-white'} text-xs px-2 py-1 rounded shadow-lg backdrop-blur-sm`}>
                  <div>{bookingDetails.startTime} - {bookingDetails.endTime}</div>
                  {isPublicView && (
                    <div className="mt-1 font-semibold text-red-100">{bookingDetails.bookedBy}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-72">
          <div className={`${isPublicView ? 'bg-gray-900 bg-opacity-95 backdrop-blur-lg border border-white border-opacity-20' : 'bg-gray-900'} text-white text-sm rounded-xl px-4 py-3 shadow-2xl`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-lg">{room.name}</h4>
              <span className={`${isPublicView ? 'bg-white bg-opacity-20' : 'bg-gray-700'} px-3 py-1 rounded-full text-xs capitalize font-medium`}>
                {room.type}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Capacity: {room.capacity}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-blue-300">Equipment:</p>
              <div className="grid grid-cols-2 gap-1">
                {room.equipment.slice(0, 4).map((eq, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-300">
                    {getEquipmentIcon(eq)}
                    <span className="truncate">{eq}</span>
                  </div>
                ))}
              </div>
              {room.equipment.length > 4 && (
                <p className="text-gray-400 text-sm">+{room.equipment.length - 4} more items</p>
              )}
            </div>

            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent ${isPublicView ? 'border-t-gray-900 border-t-opacity-95' : 'border-t-gray-900'}`}></div>
          </div>
        </div>
      )}
    </div>
  );
}