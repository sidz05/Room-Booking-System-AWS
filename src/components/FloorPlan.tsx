import React from 'react';
import { Room } from '../types/booking';
import RoomBlock from './RoomBlock';
import { Building, MapPin } from 'lucide-react';

interface FloorPlanProps {
  rooms: Room[];
  floor: 'ground' | 'first';
  bookedRooms: { [roomId: string]: any };
  onRoomClick: (roomId: string) => void;
  isPublicView?: boolean;
}

export default function FloorPlan({ rooms, floor, bookedRooms, onRoomClick, isPublicView = false }: FloorPlanProps) {
  const floorRooms = rooms.filter(room => room.floor === floor);
  
  const getFloorStats = () => {
    const totalRooms = floorRooms.length;
    const bookedCount = floorRooms.filter(room => 
      bookedRooms[room.id] && (
        typeof bookedRooms[room.id] === 'object' || bookedRooms[room.id] === true
      )
    ).length;
    return { total: totalRooms, booked: bookedCount, available: totalRooms - bookedCount };
  };

  const stats = getFloorStats();

  return (
    <div className="space-y-4">
      {/* Blueprint Grid */}
      <div className={`${isPublicView ? 'bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-20' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-6`}>
        <div className={`grid grid-cols-6 gap-3 min-h-[400px] ${isPublicView ? 'bg-gradient-to-br from-white from-opacity-5 to-white to-opacity-10' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} p-6 rounded-xl border-2 border-dashed ${isPublicView ? 'border-white border-opacity-20' : 'border-blue-200'}`}>
          {floorRooms.map(room => (
            <RoomBlock
              key={room.id}
              room={room}
              isBooked={!!(bookedRooms[room.id] && (
                typeof bookedRooms[room.id] === 'object' || bookedRooms[room.id] === true
              ))}
              onRoomClick={onRoomClick}
              bookingDetails={typeof bookedRooms[room.id] === 'object' ? bookedRooms[room.id] : null}
              isPublicView={isPublicView}
            />
          ))}
          
          {/* Empty grid spaces for blueprint aesthetic */}
          <div className={`col-start-6 row-start-2 flex items-center justify-center ${isPublicView ? 'text-white text-opacity-30' : 'text-gray-400'}`}>
            <MapPin className="w-8 h-8" />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-5 h-5 ${isPublicView ? 'bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-50' : 'bg-blue-50 border border-blue-200'} rounded`}></div>
            <span className={isPublicView ? 'text-blue-200' : 'text-gray-600'}>Lab</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-5 h-5 ${isPublicView ? 'bg-green-500 bg-opacity-20 border border-green-400 border-opacity-50' : 'bg-green-50 border border-green-200'} rounded`}></div>
            <span className={isPublicView ? 'text-green-200' : 'text-gray-600'}>Classroom</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-5 h-5 ${isPublicView ? 'bg-purple-500 bg-opacity-20 border border-purple-400 border-opacity-50' : 'bg-purple-50 border border-purple-200'} rounded`}></div>
            <span className={isPublicView ? 'text-purple-200' : 'text-gray-600'}>Office</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-5 h-5 ${isPublicView ? 'bg-orange-500 bg-opacity-20 border border-orange-400 border-opacity-50' : 'bg-orange-50 border border-orange-200'} rounded`}></div>
            <span className={isPublicView ? 'text-orange-200' : 'text-gray-600'}>Meeting Room</span>
          </div>
        </div>
      </div>
    </div>
  );
}