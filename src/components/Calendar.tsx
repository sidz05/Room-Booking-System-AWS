import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";

interface CalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const isPastDate = (year: number, month: number, day: number) => {
    const today = new Date();
    const checkDate = new Date(year, month, day);
    today.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handleDateClick = (dateString: string, isPast: boolean) => {
    if (!isPast) {
      onDateSelect(dateString);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-3"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isSelected = selectedDate === dateString;
      const isTodayDate = isToday(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isPast = isPastDate(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(dateString, isPast)}
          disabled={isPast}
          className={`
            p-4 text-sm font-semibold rounded-xl transition-all duration-300 transform
            ${
              isSelected
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl scale-110"
                : isPast
                ? "text-gray-500 cursor-not-allowed opacity-50"
                : isTodayDate
                ? "bg-blue-500 bg-opacity-30 text-blue-200 hover:bg-opacity-50 border border-blue-400 border-opacity-50"
                : "text-white hover:bg-white hover:bg-opacity-20 hover:text-white hover:scale-105"
            }
            ${!isPast && "hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-lg mx-auto border border-white border-opacity-20 hover:bg-opacity-15 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Select Date</h2>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-3 rounded-xl text-white hover:bg-white hover:bg-opacity-20 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={() => navigateMonth("next")}
          className="p-3 rounded-xl text-white hover:bg-white hover:bg-opacity-20 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-blue-200 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-blue-500 bg-opacity-20 rounded-xl border border-blue-400 border-opacity-50 backdrop-blur-sm">
          <p className="text-sm text-blue-200">
            <span className="font-semibold text-white">Selected:</span>{" "}
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
}
