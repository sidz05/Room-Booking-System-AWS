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
    <div className="space-y-6">
      {/* Floor Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-800 capitalize">
                {floor} Floor
              </h3>
              <p className="text-sm text-gray-600">
                Computer Engineering Department
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Available: {stats.available}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Booked: {stats.booked}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint Grid */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="grid grid-cols-6 gap-2 min-h-[400px] bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-dashed border-blue-200">
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
          <div className="col-start-6 row-start-2 flex items-center justify-center text-gray-400">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span className="text-gray-600">Lab</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-gray-600">Classroom</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-50 border border-purple-200 rounded"></div>
            <span className="text-gray-600">Office</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
            <span className="text-gray-600">Meeting Room</span>
          </div>
        </div>
      </div>
    </div>
  );
}