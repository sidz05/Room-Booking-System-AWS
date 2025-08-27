import React, { useState, useEffect } from 'react';
import { Room, BookingData, BookingDetails } from '../types/booking';
import { Calendar, Clock, Users, Mail, FileText, MapPin, Building, ArrowLeft, Eye, GraduationCap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header with Logo */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg p-2 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <img 
                src="https://lh3.googleusercontent.com/d/1HDL9dCyLcmEdlVENo" 
                alt="PCCOE Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-blue-600 rounded-lg items-center justify-center hidden">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">PCCOE</h1>
              <p className="text-blue-200 text-sm">Computer Engineering Department</p>
            </div>
          </div>
          
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-10 backdrop-blur-lg hover:bg-opacity-20 text-white rounded-xl transition-all duration-300 border border-white border-opacity-20 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Main Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center space-x-4 mb-6 p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl border border-white border-opacity-20">
              <Eye className="w-12 h-12 text-green-300" />
              <div className="text-left">
                <h1 className="text-4xl font-bold text-white mb-2">
                  Room Booking Notice Board
                </h1>
                <p className="text-xl text-blue-200">Real-time room availability and bookings</p>
              </div>
            </div>

            {/* Date Selector */}
            <div className="inline-flex items-center space-x-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 border border-white border-opacity-20">
              <Calendar className="w-6 h-6 text-blue-300" />
              <span className="font-medium text-white">View Date:</span>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white hover:bg-opacity-30 transition-all duration-300"
              >
                {generateDateOptions().map(date => (
                  <option key={date} value={date} className="bg-gray-800 text-white">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl border border-white border-opacity-20 p-6 hover:bg-opacity-15 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">
                    {todayStats.ground.total + todayStats.first.total}
                  </div>
                  <div className="text-blue-200">Total Rooms</div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl border border-white border-opacity-20 p-6 hover:bg-opacity-15 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-300">
                    {todayStats.ground.available + todayStats.first.available}
                  </div>
                  <div className="text-blue-200">Available Now</div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl border border-white border-opacity-20 p-6 hover:bg-opacity-15 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-300">
                    {todayStats.ground.booked + todayStats.first.booked}
                  </div>
                  <div className="text-blue-200">Currently Booked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floor Plans - Both Floors */}
          <div className="space-y-8">
            {/* Ground Floor */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl border border-white border-opacity-20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Building className="w-8 h-8 text-blue-300" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">Ground Floor</h3>
                    <p className="text-blue-200">Computer Engineering Department</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2 bg-green-500 bg-opacity-20 px-3 py-2 rounded-lg">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-200">Available: {todayStats.ground.available}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-500 bg-opacity-20 px-3 py-2 rounded-lg">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-red-200">Booked: {todayStats.ground.booked}</span>
                  </div>
                </div>
              </div>
              <FloorPlan
                rooms={rooms}
                floor="ground"
                bookedRooms={getCurrentBookings(selectedDate)}
                onRoomClick={() => {}}
                isPublicView={true}
              />
            </div>

            {/* First Floor */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl border border-white border-opacity-20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Building className="w-8 h-8 text-purple-300" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">First Floor</h3>
                    <p className="text-blue-200">Computer Engineering Department</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2 bg-green-500 bg-opacity-20 px-3 py-2 rounded-lg">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-200">Available: {todayStats.first.available}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-500 bg-opacity-20 px-3 py-2 rounded-lg">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-red-200">Booked: {todayStats.first.booked}</span>
                  </div>
                </div>
              </div>
              <FloorPlan
                rooms={rooms}
                floor="first"
                bookedRooms={getCurrentBookings(selectedDate)}
                onRoomClick={() => {}}
                isPublicView={true}
              />
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl border border-white border-opacity-20">
            <div className="p-6 border-b border-white border-opacity-20">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-blue-300" />
                <span>Upcoming Bookings</span>
              </h2>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {upcomingBookings.length === 0 ? (
                <div className="p-12 text-center text-blue-200">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-blue-300 opacity-50" />
                  <p className="text-xl font-medium text-white">No upcoming bookings</p>
                  <p className="text-blue-200">All rooms are currently available</p>
                </div>
              ) : (
                <div className="divide-y divide-white divide-opacity-10">
                  {upcomingBookings.slice(0, 10).map(({ date, roomId, booking, room }) => (
                    <div key={`${date}-${roomId}-${booking.id}`} className="p-6 hover:bg-white hover:bg-opacity-5 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-5 h-5 text-blue-300" />
                              <span className="font-semibold text-white text-lg">{room.name}</span>
                              <span className="text-xs bg-blue-500 bg-opacity-30 text-blue-200 px-3 py-1 rounded-full capitalize border border-blue-400 border-opacity-30">
                                {room.type}
                              </span>
                            </div>
                            <span className="text-sm text-green-300 font-medium bg-green-500 bg-opacity-20 px-3 py-1 rounded-full border border-green-400 border-opacity-30">
                              {new Date(date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-200 mb-3">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-blue-300" />
                              <span>
                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-blue-300" />
                              <span>{booking.participants} participants</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-blue-300" />
                              <span>{booking.purpose}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="w-4 h-4 text-purple-300" />
                            <span className="font-medium text-white">
                              Faculty: {booking.bookedBy}
                            </span>
                            <span className="text-purple-200">({booking.email})</span>
                          </div>

                          {booking.notes && (
                            <div className="mt-3 p-3 bg-blue-500 bg-opacity-20 rounded-lg text-sm text-blue-100 border border-blue-400 border-opacity-30">
                              <strong className="text-blue-200">Notes:</strong> {booking.notes}
                            </div>
                          )}
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
    </div>
  );
}