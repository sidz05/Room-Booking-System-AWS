import React, { useState } from 'react';
import { X, Clock, Users, FileText, Mail, User } from 'lucide-react';
import { Room, BookingDetails } from '../types/booking';

interface BookingFormProps {
  room: Room;
  date: string;
  existingBooking?: BookingDetails;
  onSubmit: (bookingDetails: BookingDetails) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function BookingForm({ 
  room, 
  date, 
  existingBooking, 
  onSubmit, 
  onCancel, 
  onDelete 
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    bookedBy: existingBooking?.bookedBy || '',
    email: existingBooking?.email || '',
    purpose: existingBooking?.purpose || '',
    startTime: existingBooking?.startTime || '09:00',
    endTime: existingBooking?.endTime || '10:00',
    participants: existingBooking?.participants || 1,
    notes: existingBooking?.notes || ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.bookedBy.trim()) {
      newErrors.bookedBy = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    if (formData.startTime >= formData.endTime) {
      newErrors.time = 'End time must be after start time';
    }

    if (formData.participants < 1 || formData.participants > room.capacity) {
      newErrors.participants = `Participants must be between 1 and ${room.capacity}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const bookingDetails: BookingDetails = {
      id: existingBooking?.id || `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
      createdAt: existingBooking?.createdAt || new Date().toISOString()
    };

    onSubmit(bookingDetails);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {existingBooking ? 'Edit Booking' : 'Book Room'}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {room.name} • {formatDate(date)}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Personal Information</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.bookedBy}
                onChange={(e) => handleInputChange('bookedBy', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bookedBy ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.bookedBy && (
                <p className="text-red-500 text-xs mt-1">{errors.bookedBy}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@university.edu"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Booking Details</span>
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.purpose ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Lab Session, Meeting, Study Group"
                />
              </div>
              {errors.purpose && (
                <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {errors.time && (
              <p className="text-red-500 text-xs">{errors.time}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Participants *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  max={room.capacity}
                  value={formData.participants}
                  onChange={(e) => handleInputChange('participants', parseInt(e.target.value) || 1)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.participants ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Maximum capacity: {room.capacity} people
              </p>
              {errors.participants && (
                <p className="text-red-500 text-xs mt-1">{errors.participants}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Any special requirements or notes..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            {existingBooking && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Delete Booking
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              {existingBooking ? 'Update Booking' : 'Book Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}