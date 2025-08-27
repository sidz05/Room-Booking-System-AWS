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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden p-4">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
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
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">PCCOE</h1>
                <p className="text-blue-200 text-sm">Computer Engineering Department</p>
              </div>
            </div>
            
            <button
              onClick={handleBackToLogin}
              className="px-6 py-3 bg-white bg-opacity-10 backdrop-blur-lg hover:bg-opacity-20 text-white rounded-xl transition-all duration-300 border border-white border-opacity-20 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center space-x-4 mb-6 p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl border border-white border-opacity-20">
                <Settings className="w-12 h-12 text-blue-300" />
                <div className="text-left">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-xl text-blue-200">Room Booking System</p>
                </div>
              </div>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Select a date to manage room bookings and reservations
              </p>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden p-4">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="relative z-10">
            <BookingInterface
              rooms={rooms}
              selectedDate={selectedDate}
              onBack={handleBackToCalendar}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}