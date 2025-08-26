import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

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

  // handle click on date → save date + navigate
  const handleDateClick = (dateString: string, isPast: boolean) => {
    if (!isPast) {
      onDateSelect(dateString);
      navigate("/FloorPlan.tsx"); // go to next screen
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
            p-3 text-sm font-medium rounded-lg transition-all duration-200
            ${
              isSelected
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : isPast
                ? "text-gray-400 cursor-not-allowed"
                : isTodayDate
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }
            ${!isPast && "hover:scale-105 active:scale-95"}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Select Date</h2>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={() => navigateMonth("next")}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Selected:</span>{" "}
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
