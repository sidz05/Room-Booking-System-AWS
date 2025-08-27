import React, { useState, useEffect } from 'react';
import { Room, BookingData, BookingDetails } from '../types/booking';
import { Calendar, Clock, Users, Mail, FileText, MapPin, Building, ArrowLeft, Eye } from 'lucide-react';
import FloorPlan from './FloorPlan';

interface PublicNoticeBoardProps {
  rooms: Room[];
  onBack: () => void;
}

export default function PublicNoticeBoard({ rooms, onBack }: PublicNoticeBoardProps) {
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [activeFloor, setActiveFloor] = useState<'ground' | 'first'>('ground');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    // Load booking data from localStorage
    const savedData = localStorage.getItem('roomBookings');
    if (savedData) {
      setBookingData(JSON.parse(savedData));
    }
  }, []);

  const getCurrentBookings = (date: string) => {
    return bookingData[date] || {};
  };

  const getUpcomingBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingBookings: Array<{
      date: string;
      roomId: string;
      booking: BookingDetails;
      room: Room;
    }> = [];

    Object.entries(bookingData).forEach(([date, roomBookings]) => {
      const bookingDate = new Date(date);
      if (bookingDate >= today) {
        Object.entries(roomBookings).forEach(([roomId, booking]) => {
          const room = rooms.find(r => r.id === roomId);
          if (room && typeof booking === 'object' && booking.id) {
            upcomingBookings.push({ date, roomId, booking, room });
          }
        });
      }
    });

    return upcomingBookings.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.booking.startTime.localeCompare(b.booking.startTime);
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getFloorStats = (floor: 'ground' | 'first', date: string) => {
    const floorRooms = rooms.filter(room => room.floor === floor);
    const currentBookings = getCurrentBookings(date);
    const totalRooms = floorRooms.length;
    const bookedCount = floorRooms.filter(room => 
      currentBookings[room.id] && (
        typeof currentBookings[room.id] === 'object' || currentBookings[room.id] === true
      )
    ).length;
    return { total: totalRooms, booked: bookedCount, available: totalRooms - bookedCount };
  };

  const upcomingBookings = getUpcomingBookings();
  const todayStats = {
    ground: getFloorStats('ground', selectedDate),
    first: getFloorStats('first', selectedDate)
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatDateOption = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Eye className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Room Booking Notice Board
                </h1>
                <p className="text-gray-600">Real-time room availability and bookings</p>
              </div>
            </div>
            
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Date Selector */}
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">View Date:</span>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {generateDateOptions().map(date => (
                <option key={date} value={date}>
                  {formatDateOption(date)} - {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {todayStats.ground.total + todayStats.first.total}
                </div>
                <div className="text-gray-600">Total Rooms</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {todayStats.ground.available + todayStats.first.available}
                </div>
                <div className="text-gray-600">Available Now</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {todayStats.ground.booked + todayStats.first.booked}
                </div>
                <div className="text-gray-600">Currently Booked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floor Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveFloor('ground')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeFloor === 'ground'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Ground Floor ({todayStats.ground.available}/{todayStats.ground.total} Available)
          </button>
          <button
            onClick={() => setActiveFloor('first')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeFloor === 'first'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            First Floor ({todayStats.first.available}/{todayStats.first.total} Available)
          </button>
        </div>

        {/* Floor Plan */}
        <FloorPlan
          rooms={rooms}
          floor={activeFloor}
          bookedRooms={getCurrentBookings(selectedDate)}
          onRoomClick={() => {}} // Disabled for public view
          isPublicView={true}
        />

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              <span>Upcoming Bookings</span>
            </h2>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {upcomingBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No upcoming bookings</p>
                <p className="text-sm">All rooms are currently available</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {upcomingBookings.slice(0, 10).map(({ date, roomId, booking, room }) => (
                  <div key={`${date}-${roomId}-${booking.id}`} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-800">{room.name}</span>
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded capitalize">
                              {room.type}
                            </span>
                          </div>
                          <span className="text-sm text-blue-600 font-medium">
                            {new Date(date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{booking.participants} participants</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>{booking.purpose}</span>
                          </div>
                        </div>

                        <div className="mt-2 text-sm">
                          <span className="font-medium text-gray-700">
                            Faculty: {booking.bookedBy}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}