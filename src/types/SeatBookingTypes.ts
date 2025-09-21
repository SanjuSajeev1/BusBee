// Types for seat booking functionality

export interface Seat {
  id: string;
  number: string;
  type: "window" | "aisle" | "middle";
  status: "available" | "occupied" | "selected";
  row: number;
  column: number;
}

export interface Passenger {
  seatNumber: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  email?: string;
  phone?: string;
}

export interface SeatBookingData {
  busId: string;
  operator: string;
  busNumber: string;
  from: string;
  to: string;
  price: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  type: string;
  rating: string;
  amenities: string[];
  selectedSeats: string[];
  seatNumbers: string[];
  passengerDetails: Passenger[];
  totalPrice: number;
  convenienceFee: number;
}

export interface BusSeatLayout {
  busId: string;
  totalSeats: number;
  rows: number;
  columns: number;
  layout: "2-2" | "2-1" | "3-2"; // Common bus seat configurations
  seats: Seat[];
  amenities: string[];
}

export interface SeatSelectionResult {
  selectedSeats: string[];
  seatNumbers: string[];
  totalAmount: number;
  passengers: Passenger[];
}

export interface BookingSummary {
  busInfo: {
    operator: string;
    busNumber: string;
    type: string;
    amenities: string[];
  };
  journey: {
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    date: string;
  };
  passengers: Passenger[];
  seats: {
    selectedSeats: string[];
    seatNumbers: string[];
  };
  pricing: {
    basePrice: number;
    convenienceFee: number;
    totalAmount: number;
  };
}
