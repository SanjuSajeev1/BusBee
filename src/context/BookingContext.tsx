import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface BookingData {
  id: string;
  route: string;
  fromStop: string;
  toStop: string;
  date: string;
  time: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  passengers: number;
  price: string;
  totalPrice: string;
  operator: string;
  status: "confirmed" | "completed" | "cancelled";
  bookingId: string;
  bookingDate: string;
  busNumber: string;
  platform: string;
  qrCode: string;
}

interface BookingContextType {
  bookings: BookingData[];
  addBooking: (booking: Omit<BookingData, "id" | "bookingId" | "qrCode">) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: BookingData["status"]) => Promise<void>;
  isLoading: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const BOOKINGS_STORAGE_KEY = "@busbee_bookings";

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookings from storage on app start
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const storedBookings = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBookings = async (updatedBookings: BookingData[]) => {
    try {
      await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
    } catch (error) {
      console.error("Failed to save bookings:", error);
    }
  };

  const generateBookingId = (): string => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `BB${timestamp}${random}`;
  };

  const addBooking = async (bookingData: Omit<BookingData, "id" | "bookingId" | "qrCode">) => {
    const bookingId = generateBookingId();
    const newBooking: BookingData = {
      ...bookingData,
      id: Date.now().toString(),
      bookingId,
      qrCode: `${bookingId}QR`,
      status: "confirmed",
    };

    const updatedBookings = [newBooking, ...bookings];
    await saveBookings(updatedBookings);
  };

  const updateBookingStatus = async (bookingId: string, status: BookingData["status"]) => {
    const updatedBookings = bookings.map((booking) =>
      booking.bookingId === bookingId ? { ...booking, status } : booking
    );
    await saveBookings(updatedBookings);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBookingStatus,
        isLoading,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
