import React, { useState } from "react";
import Calendar from "./components/Calendar";
import BookingInterface from "./components/BookingInterface";
import Login from "./components/Login";
import PublicNoticeBoard from "./components/PublicNoticeBoard";
import { rooms } from "./data/rooms";

type AppView = 'login' | 'calendar' | 'booking' | 'notice';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('calendar');
  };

  const handleViewNoticeBoard = () => {
    setCurrentView('notice');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCurrentView('booking');
  };

  const handleBackToCalendar = () => {
    setCurrentView('calendar');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
    setIsAuthenticated(false);
  };

  if (currentView === 'login') {
    return (
      <Login 
        onLogin={handleLogin}
        onViewNoticeBoard={handleViewNoticeBoard}
      />
    );
  }

  if (currentView === 'notice') {
    return (
      <PublicNoticeBoard 
        rooms={rooms}
        onBack={handleBackToLogin}
      />
    );
  }

  if (currentView === 'calendar') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Computer Engineering Department
              </h1>
              <p className="text-xl text-gray-600">Room Booking System - Admin Panel</p>
              <button
                onClick={handleBackToLogin}
                className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'booking' && selectedDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <BookingInterface
            rooms={rooms}
            selectedDate={selectedDate}
            onBack={handleBackToCalendar}
          />
        </div>
      </div>
    );
  }

  return null;
}