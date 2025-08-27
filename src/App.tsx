import React, { useState } from "react";
import Calendar from "./components/Calendar";
import BookingInterface from "./components/BookingInterface";
import { rooms } from "./data/rooms";

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showBookingInterface, setShowBookingInterface] = useState(false);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowBookingInterface(true);
  };

  const handleBackToCalendar = () => {
    setShowBookingInterface(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {!showBookingInterface ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Computer Engineering Department
              </h1>
              <p className="text-xl text-gray-600">Room Booking System</p>
            </div>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        ) : (
          <BookingInterface
            rooms={rooms}
            selectedDate={selectedDate!}
            onBack={handleBackToCalendar}
          />
        )}
      </div>
    </div>
  );
}