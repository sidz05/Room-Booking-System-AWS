export interface Room {
  id: string;
  name: string;
  type: 'lab' | 'classroom' | 'office' | 'meeting';
  capacity: number;
  equipment: string[];
  floor: 'ground' | 'first';
  gridPosition: {
    row: number;
    col: number;
    width: number;
    height: number;
  };
}

export interface Booking {
  roomId: string;
  date: string;
  isBooked: boolean;
  bookingDetails?: BookingDetails;
}

export interface BookingDetails {
  id: string;
  bookedBy: string;
  email: string;
  purpose: string;
  startTime: string;
  endTime: string;
  participants: number;
  notes?: string;
  createdAt: string;
}

export interface BookingData {
  [date: string]: {
    [roomId: string]: BookingDetails | boolean;
  };
}