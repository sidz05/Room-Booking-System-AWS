import React, { useState, useEffect } from 'react';
import { Room, BookingData, BookingDetails } from '../types/booking';
import FloorPlan from './FloorPlan';
import BookingForm from './BookingForm';
import NoticeBoard from './NoticeBoard';
import { Building2, RotateCcw, CheckCircle, Eye, Settings } from 'lucide-react';

interface BookingInterfaceProps {
  rooms: Room[];
  selectedDate: string;
  onBack: () => void;
}

export default function BookingInterface({ rooms, selectedDate, onBack }: BookingInterfaceProps) {
  const [activeFloor, setActiveFloor] = useState<'ground' | 'first'>('ground');
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [viewMode, setViewMode] = useState<'admin' | 'notice'>('admin');

  useEffect(() => {
    // Load booking data from localStorage
    const savedData = localStorage.getItem('roomBookings');
    if (savedData) {
      setBookingData(JSON.parse(savedData));
    }
  }, []);

  const saveBookingData = (data: BookingData) => {
    localStorage.setItem('roomBookings', JSON.stringify(data));
  };

  const handleRoomClick = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (bookingDetails: BookingDetails) => {
    const newBookingData = { ...bookingData };
    
    if (!newBookingData[selectedDate]) {
      newBookingData[selectedDate] = {};
    }

    if (selectedRoom) {
      newBookingData[selectedDate][selectedRoom.id] = bookingDetails;
    }
    
    setBookingData(newBookingData);
    saveBookingData(newBookingData);
    setShowBookingForm(false);
    setSelectedRoom(null);
  };

  const handleBookingDelete = () => {
    if (!selectedRoom) return;

    const newBookingData = { ...bookingData };
    if (newBookingData[selectedDate] && newBookingData[selectedDate][selectedRoom.id]) {
      delete newBookingData[selectedDate][selectedRoom.id];
      
      // Clean up empty date entries
      if (Object.keys(newBookingData[selectedDate]).length === 0) {
        delete newBookingData[selectedDate];
      }
    }
    
    setBookingData(newBookingData);
    saveBookingData(newBookingData);
    setShowBookingForm(false);
    setSelectedRoom(null);
  };

  const getCurrentBookings = () => {
    return bookingData[selectedDate] || {};
  };

  const getBookingStats = () => {
    const currentBookings = getCurrentBookings();
    const totalRooms = rooms.length;
    const bookedCount = Object.values(currentBookings).filter(booking => 
      booking && (typeof booking === 'object' || booking === true)
    ).length;
    return { total: totalRooms, booked: bookedCount, available: totalRooms - bookedCount };
  };

  const resetAllBookings = () => {
    const newBookingData = { ...bookingData };
    if (newBookingData[selectedDate]) {
      delete newBookingData[selectedDate];
      setBookingData(newBookingData);
      saveBookingData(newBookingData);
    }
  };

  const stats = getBookingStats();

  const getExistingBooking = (): BookingDetails | undefined => {
    if (!selectedRoom) return undefined;
    const booking = getCurrentBookings()[selectedRoom.id];
    return typeof booking === 'object' ? booking : undefined;
  };

  // Get all bookings with details for notice board
  const getAllBookingsWithDetails = () => {
    const detailedBookings: { [date: string]: { [roomId: string]: BookingDetails } } = {};
    
    Object.entries(bookingData).forEach(([date, roomBookings]) => {
      const dateBookings: { [roomId: string]: BookingDetails } = {};
      Object.entries(roomBookings).forEach(([roomId, booking]) => {
        if (typeof booking === 'object' && booking.id) {
          dateBookings[roomId] = booking;
        }
      });
      if (Object.keys(dateBookings).length > 0) {
        detailedBookings[date] = dateBookings;
      }
    });
    
    return detailedBookings;
  };

  if (viewMode === 'notice') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="w-7 h-7 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Notice Board View
                </h1>
                <p className="text-gray-600">Public view for students and faculty</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('admin')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Admin View</span>
              </button>
              
              <button
                onClick={onBack}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                Back to Calendar
              </button>
            </div>
          </div>
        </div>

        <NoticeBoard bookings={getAllBookingsWithDetails()} rooms={rooms} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Manage room bookings and reservations</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('notice')}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              <span>Notice Board</span>
            </button>
            
            <button
              onClick={resetAllBookings}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All</span>
            </button>
            
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Change Date
            </button>
          </div>
        </div>

        {/* Date and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-gray-800 text-lg">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          <div className="flex items-center space-x-8 text-sm">
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-800">{stats.total}</div>
              <div className="text-gray-600">Total Rooms</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-green-600">{stats.available}</div>
              <div className="text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-red-600">{stats.booked}</div>
              <div className="text-gray-600">Booked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-2 rounded-xl w-fit shadow-lg">
        <button
          onClick={() => setActiveFloor('ground')}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
            activeFloor === 'ground'
              ? 'bg-white text-blue-600 shadow-lg scale-105'
              : 'text-gray-600 hover:text-gray-800 hover:scale-105'
          }`}
        >
          Ground Floor
        </button>
        <button
          onClick={() => setActiveFloor('first')}
          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
            activeFloor === 'first'
              ? 'bg-white text-blue-600 shadow-lg scale-105'
              : 'text-gray-600 hover:text-gray-800 hover:scale-105'
          }`}
        >
          First Floor
        </button>
      </div>

      {/* Floor Plan */}
      <FloorPlan
        rooms={rooms}
        floor={activeFloor}
        bookedRooms={getCurrentBookings()}
        onRoomClick={handleRoomClick}
      />

      {/* Booking Form Modal */}
      {showBookingForm && selectedRoom && (
        <BookingForm
          room={selectedRoom}
          date={selectedDate}
          existingBooking={getExistingBooking()}
          onSubmit={handleBookingSubmit}
          onCancel={() => {
            setShowBookingForm(false);
            setSelectedRoom(null);
          }}
          onDelete={getExistingBooking() ? handleBookingDelete : undefined}
        />
      )}
    </div>
  );
}