// Service for handling journey search and multi-leg route calculations
import { JourneyResult, MultiLegJourney, BusRoute, JourneyLeg, JourneyStop } from "../types/JourneyTypes";

// Mock API endpoint - replace with actual backend URL
const API_BASE_URL = "https://api.busbee.com"; // Replace with your backend URL

export interface SearchJourneyParams {
  from: string;
  to: string;
  date?: string;
  time?: string;
  passengers?: number;
}

export interface ApiJourneyResponse {
  directRoutes: BusRoute[];
  multiLegRoutes: MultiLegJourney[];
  hasDirectRoutes: boolean;
  hasMultiLegRoutes: boolean;
  searchId: string;
  timestamp: string;
}

/**
 * Search for available journeys (both direct and multi-leg)
 */
export async function searchJourneys(params: SearchJourneyParams): Promise<JourneyResult> {
  try {
    // In a real app, this would make an API call to your backend
    const response = await fetch(`${API_BASE_URL}/api/journeys/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: params.from,
        to: params.to,
        date: params.date || new Date().toISOString().split('T')[0],
        time: params.time,
        passengers: params.passengers || 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: ApiJourneyResponse = await response.json();
    
    return {
      directRoutes: data.directRoutes,
      multiLegRoutes: data.multiLegRoutes,
      hasDirectRoutes: data.hasDirectRoutes,
      hasMultiLegRoutes: data.hasMultiLegRoutes,
    };
  } catch (error) {
    console.error('Error searching journeys:', error);
    
    // Fallback to mock data for development
    return getMockJourneyData(params);
  }
}

/**
 * Get journey details by ID
 */
export async function getJourneyDetails(journeyId: string): Promise<MultiLegJourney | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/journeys/${journeyId}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching journey details:', error);
    return null;
  }
}

/**
 * Calculate transfer time between two legs
 */
export function calculateTransferTime(
  arrivalTime: string,
  departureTime: string
): string {
  const arrival = new Date(`2000-01-01 ${arrivalTime}`);
  const departure = new Date(`2000-01-01 ${departureTime}`);
  
  const diffMs = departure.getTime() - arrival.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  } else {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
}

/**
 * Calculate total journey duration including transfers
 */
export function calculateTotalJourneyDuration(legs: JourneyLeg[]): string {
  if (legs.length === 0) return "0 min";
  
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];
  
  const startTime = new Date(`2000-01-01 ${firstLeg.departureTime}`);
  const endTime = new Date(`2000-01-01 ${lastLeg.arrivalTime}`);
  
  const diffMs = endTime.getTime() - startTime.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  } else {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
}

/**
 * Calculate total journey price
 */
export function calculateTotalJourneyPrice(legs: JourneyLeg[]): number {
  return legs.reduce((total, leg) => total + leg.price, 0);
}

/**
 * Mock data for development - replace with actual API calls
 */
function getMockJourneyData(params: SearchJourneyParams): JourneyResult {
  // This would be replaced with actual API data
  return {
    directRoutes: [],
    multiLegRoutes: [],
    hasDirectRoutes: false,
    hasMultiLegRoutes: false,
  };
}

/**
 * Validate journey search parameters
 */
export function validateSearchParams(params: SearchJourneyParams): string[] {
  const errors: string[] = [];
  
  if (!params.from || params.from.trim().length === 0) {
    errors.push("Departure location is required");
  }
  
  if (!params.to || params.to.trim().length === 0) {
    errors.push("Destination location is required");
  }
  
  if (params.from && params.to && params.from.toLowerCase() === params.to.toLowerCase()) {
    errors.push("Departure and destination cannot be the same");
  }
  
  if (params.passengers && (params.passengers < 1 || params.passengers > 10)) {
    errors.push("Number of passengers must be between 1 and 10");
  }
  
  return errors;
}

/**
 * Format time for display
 */
export function formatTime(timeString: string): string {
  try {
    const time = new Date(`2000-01-01 ${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return timeString;
  }
}

/**
 * Get transfer instructions based on stop locations
 */
export function getTransferInstructions(
  fromStop: JourneyStop,
  toStop: JourneyStop
): string {
  // In a real app, this would use actual stop data and routing
  if (fromStop.name.toLowerCase().includes('hub') || 
      fromStop.name.toLowerCase().includes('station')) {
    return `Walk to connecting platform - follow signs to ${toStop.name}`;
  }
  
  if (fromStop.name.toLowerCase().includes('mall') || 
      fromStop.name.toLowerCase().includes('center')) {
    return `Walk to nearby bus stop - look for route signs`;
  }
  
  return `Walk to connecting bus stop - check route boards`;
}
