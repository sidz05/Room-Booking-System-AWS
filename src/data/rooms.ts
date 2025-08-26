import { Room } from '../types/booking';

export const rooms: Room[] = [
  // Ground Floor Rooms
  {
    id: 'lab101',
    name: 'Lab 101',
    type: 'lab',
    capacity: 30,
    equipment: ['Computers', 'Projector', 'Whiteboard', 'Air Conditioning'],
    floor: 'ground',
    gridPosition: { row: 1, col: 1, width: 2, height: 2 }
  },
  {
    id: 'lab102',
    name: 'Lab 102',
    type: 'lab',
    capacity: 25,
    equipment: ['Computers', 'Network Equipment', 'Projector'],
    floor: 'ground',
    gridPosition: { row: 1, col: 4, width: 2, height: 2 }
  },
  {
    id: 'room103',
    name: 'Room 103',
    type: 'classroom',
    capacity: 40,
    equipment: ['Projector', 'Whiteboard', 'Audio System'],
    floor: 'ground',
    gridPosition: { row: 4, col: 1, width: 3, height: 2 }
  },
  {
    id: 'meeting104',
    name: 'Meeting 104',
    type: 'meeting',
    capacity: 12,
    equipment: ['Projector', 'Conference Table', 'Video Conferencing'],
    floor: 'ground',
    gridPosition: { row: 4, col: 5, width: 1, height: 1 }
  },
  {
    id: 'office105',
    name: 'Office 105',
    type: 'office',
    capacity: 4,
    equipment: ['Computers', 'Printer'],
    floor: 'ground',
    gridPosition: { row: 6, col: 1, width: 1, height: 1 }
  },
  {
    id: 'office106',
    name: 'Office 106',
    type: 'office',
    capacity: 4,
    equipment: ['Computers', 'Scanner'],
    floor: 'ground',
    gridPosition: { row: 6, col: 3, width: 1, height: 1 }
  },

  // First Floor Rooms
  {
    id: 'lab201',
    name: 'Lab 201',
    type: 'lab',
    capacity: 35,
    equipment: ['High-end Computers', 'Graphics Cards', 'Projector', '3D Printers'],
    floor: 'first',
    gridPosition: { row: 1, col: 1, width: 2, height: 2 }
  },
  {
    id: 'lab202',
    name: 'Lab 202',
    type: 'lab',
    capacity: 28,
    equipment: ['Embedded Systems', 'Microcontrollers', 'Oscilloscopes'],
    floor: 'first',
    gridPosition: { row: 1, col: 4, width: 2, height: 2 }
  },
  {
    id: 'room203',
    name: 'Room 203',
    type: 'classroom',
    capacity: 50,
    equipment: ['Smart Board', 'Projector', 'Sound System', 'Recording Equipment'],
    floor: 'first',
    gridPosition: { row: 4, col: 1, width: 3, height: 2 }
  },
  {
    id: 'meeting204',
    name: 'Meeting 204',
    type: 'meeting',
    capacity: 8,
    equipment: ['Video Wall', 'Conference Table', 'Wireless Display'],
    floor: 'first',
    gridPosition: { row: 4, col: 5, width: 1, height: 1 }
  },
  {
    id: 'office205',
    name: 'Faculty 205',
    type: 'office',
    capacity: 6,
    equipment: ['Workstations', 'Research Equipment', 'Library'],
    floor: 'first',
    gridPosition: { row: 6, col: 1, width: 2, height: 1 }
  },
  {
    id: 'office206',
    name: 'Office 206',
    type: 'office',
    capacity: 3,
    equipment: ['Computers', 'Printer', 'Server Access'],
    floor: 'first',
    gridPosition: { row: 6, col: 4, width: 1, height: 1 }
  }
];