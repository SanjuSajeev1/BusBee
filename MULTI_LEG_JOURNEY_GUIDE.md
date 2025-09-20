# Multi-Leg Journey Feature Guide

## Overview
The BusBee app now supports multi-leg journeys with transfers, similar to apps like Chalo. When no direct bus is available, users can see alternative routes with one or more transfers.

## Features Implemented

### 1. Multi-Leg Journey Display
- **Journey Cards**: Each multi-leg journey is displayed as a comprehensive card showing:
  - Total journey duration and price
  - Number of transfers
  - Individual leg details with bus numbers, operators, and timings
  - Transfer instructions and waiting times

### 2. Journey Leg Components
- **Individual Leg Display**: Each leg shows:
  - Bus number and operator
  - Departure and arrival times
  - Route stops (limited to first 3 stops for readability)
  - Amenities available
  - Transfer instructions for connecting buses

### 3. Enhanced Results Page
- **Dual Display**: Shows both direct routes and multi-leg journeys
- **Toggle Options**: Users can choose to see "All Routes" or "Direct Only"
- **Filtering**: Multi-leg journeys respect the same time filters as direct routes
- **Section Headers**: Clear separation between direct and multi-leg results

### 4. Transfer Logic
- **Transfer Time Calculation**: Automatic calculation of waiting times between connections
- **Transfer Instructions**: Context-aware instructions for each transfer point
- **Visual Indicators**: Clear visual separation between journey legs

## File Structure

### New Files Created:
```
src/
├── types/
│   └── JourneyTypes.ts          # Type definitions for multi-leg journeys
├── components/
│   ├── MultiLegJourney.tsx      # Main multi-leg journey component
│   └── JourneyLeg.tsx           # Individual journey leg component
└── utils/
    └── journeyService.ts        # API service and utility functions
```

### Modified Files:
```
app/(search)/
└── results.tsx                  # Updated to handle multi-leg journeys
```

## Data Structure

### MultiLegJourney Interface:
```typescript
interface MultiLegJourney {
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
```

### JourneyLeg Interface:
```typescript
interface JourneyLeg {
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
  transferTime?: string;
  transferInstructions?: string;
}
```

## API Integration

### Backend Requirements:
Your backend API should provide an endpoint that returns:
```json
{
  "directRoutes": [...],
  "multiLegRoutes": [...],
  "hasDirectRoutes": true,
  "hasMultiLegRoutes": true,
  "searchId": "unique-search-id",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### API Service:
The `journeyService.ts` file provides:
- `searchJourneys()`: Main function to search for routes
- `calculateTransferTime()`: Calculate waiting times between legs
- `calculateTotalJourneyDuration()`: Calculate total journey time
- `validateSearchParams()`: Validate search parameters
- `getTransferInstructions()`: Generate transfer instructions

## Usage Examples

### 1. Basic Multi-Leg Journey Display:
```typescript
<MultiLegJourneyComponent
  journey={multiLegJourney}
  fromLocation="Downtown Station"
  toLocation="Airport Terminal"
/>
```

### 2. Individual Journey Leg:
```typescript
<JourneyLegComponent
  leg={journeyLeg}
  legNumber={1}
  isLastLeg={false}
/>
```

### 3. Search for Journeys:
```typescript
const results = await searchJourneys({
  from: "Downtown Station",
  to: "Airport Terminal",
  date: "2024-01-01",
  passengers: 2
});
```

## UI/UX Features

### Visual Design:
- **Color Coding**: Different colors for Private vs Limited Stop buses
- **Transfer Indicators**: Visual dots and labels for transfer points
- **Progress Indicators**: Numbered legs with connecting lines
- **Amenity Icons**: Emoji-based icons for bus amenities
- **Rating Display**: Star ratings for each bus operator

### User Experience:
- **Clear Hierarchy**: Direct routes shown first, then multi-leg options
- **Toggle Control**: Easy switching between "All Routes" and "Direct Only"
- **Detailed Information**: Comprehensive details for each leg
- **Transfer Guidance**: Clear instructions for each transfer point

## Sample Data

The implementation includes sample multi-leg journeys:
1. **1-Transfer Journey**: Downtown → Central Hub → Airport Terminal
2. **2-Transfer Journey**: Downtown → University Gate → Shopping Mall → Airport Terminal

## Future Enhancements

### Potential Improvements:
1. **Real-time Updates**: Live bus tracking for each leg
2. **Alternative Routes**: Show multiple multi-leg options
3. **Price Comparison**: Highlight cheapest/fastest options
4. **Booking Integration**: Direct booking for multi-leg journeys
5. **Offline Support**: Cache journey data for offline viewing
6. **Accessibility**: Enhanced accessibility features
7. **Push Notifications**: Alerts for transfer times and delays

## Testing

### Test Scenarios:
1. **No Direct Routes**: Verify multi-leg journeys are shown when no direct routes exist
2. **Mixed Results**: Test with both direct and multi-leg options available
3. **Filtering**: Ensure filters work correctly for multi-leg journeys
4. **Transfer Times**: Verify transfer time calculations are accurate
5. **Navigation**: Test navigation to booking/tracking screens

### Sample Test Data:
The implementation includes comprehensive sample data covering:
- Direct routes with different operators and amenities
- Multi-leg journeys with 1 and 2 transfers
- Various bus types (Private, Limited Stop)
- Different transfer scenarios and instructions

## Integration Notes

### Backend Integration:
1. Update your backend API to support multi-leg route calculations
2. Implement route optimization algorithms for best transfer points
3. Provide real-time data for bus schedules and delays
4. Include transfer time recommendations based on historical data

### Frontend Integration:
1. Replace mock data with actual API calls
2. Implement error handling for failed API requests
3. Add loading states for journey searches
4. Implement caching for frequently searched routes

This implementation provides a solid foundation for multi-leg journey support in the BusBee app, with room for future enhancements and optimizations.
