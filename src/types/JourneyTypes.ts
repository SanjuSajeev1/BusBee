// Types for multi-leg journey support

export interface JourneyStop {
  id: string;
  name: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface JourneyLeg {
  id: string;
  busNumber: string;
  operator: string;
  fromStop: JourneyStop;
  toStop: JourneyStop;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  type: "Private" | "Limited Stop";
  seatsAvailable: number;
  amenities: string[];
  rating: number;
  stops: JourneyStop[];
  isTransfer?: boolean;
  transferTime?: string; // Time to wait for next bus
  transferInstructions?: string;
}

export interface MultiLegJourney {
  id: string;
  totalDuration: string;
  totalPrice: number;
  totalTransfers: number;
  legs: JourneyLeg[];
  fromLocation: string;
  toLocation: string;
  departureTime: string;
  arrivalTime: string;
  isDirect: boolean;
}

export interface JourneyResult {
  directRoutes: BusRoute[];
  multiLegRoutes: MultiLegJourney[];
  hasDirectRoutes: boolean;
  hasMultiLegRoutes: boolean;
}

// Keep existing BusRoute interface for direct routes
export interface BusRoute {
  id: string;
  operator: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  type: "Private" | "Limited Stop";
  seatsAvailable: number;
  amenities: string[];
  rating: number;
}
