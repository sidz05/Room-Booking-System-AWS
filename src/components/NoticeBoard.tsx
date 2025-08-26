import React, { useState } from 'react';
import { BookingDetails, Room } from '../types/booking';
import { Calendar, Clock, Users, Mail, FileText, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface NoticeBoardProps {
  bookings: { [date: string]: { [roomId: string]: BookingDetails } };
  rooms: Room[];
}

export default function NoticeBoard({ bookings, rooms }: NoticeBoardProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<'all' | 'ground' | 'first'>('all');

  const getRoomById = (roomId: string) => {
    return rooms.find(room => room.id === roomId);
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

    Object.entries(bookings).forEach(([date, roomBookings]) => {
      const bookingDate = new Date(date);
      if (bookingDate >= today) {
        Object.entries(roomBookings).forEach(([roomId, booking]) => {
          const room = getRoomById(roomId);
          if (room && typeof booking === 'object' && booking.id) {
            if (selectedFloor === 'all' || room.floor === selectedFloor) {
              upcomingBookings.push({ date, roomId, booking, room });
            }
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

  const groupBookingsByDate = (bookings: ReturnType<typeof getUpcomingBookings>) => {
    const grouped: { [date: string]: typeof bookings } = {};
    bookings.forEach(booking => {
      if (!grouped[booking.date]) {
        grouped[booking.date] = [];
      }
      grouped[booking.date].push(booking);
    });
    return grouped;
  };

  const formatDate = (dateString: string) => {
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
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const upcomingBookings = getUpcomingBookings();
  const groupedBookings = groupBookingsByDate(upcomingBookings);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Room Booking Notice Board</h2>
            <p className="text-blue-100 mt-1">
              Upcoming room reservations for students and faculty
            </p>
          </div>
          <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            <div className="text-sm text-blue-100">Active Bookings</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by floor:</span>
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All Floors' },
              { value: 'ground', label: 'Ground Floor' },
              { value: 'first', label: 'First Floor' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedFloor(option.value as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFloor === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="max-h-96 overflow-y-auto">
        {Object.keys(groupedBookings).length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No upcoming bookings</p>
            <p className="text-sm">All rooms are currently available</p>
          </div>
        ) : (
          Object.entries(groupedBookings).map(([date, dateBookings]) => (
            <div key={date} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => setExpandedDate(expandedDate === date ? null : date)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {formatDate(date)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {dateBookings.length} booking{dateBookings.length !== 1 ? 's' : ''}
                    </span>
                    {expandedDate === date ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {expandedDate === date && (
                <div className="bg-gray-50 border-t border-gray-200">
                  {dateBookings.map(({ roomId, booking, room }) => (
                    <div key={`${roomId}-${booking.id}`} className="p-4 border-b border-gray-200 last:border-b-0">
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
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{booking.participants} participants</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{booking.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <FileText className="w-4 h-4" />
                              <span>{booking.purpose}</span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-700">
                              Booked by: {booking.bookedBy}
                            </span>
                          </div>

                          {booking.notes && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-gray-700">
                              <strong>Notes:</strong> {booking.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}