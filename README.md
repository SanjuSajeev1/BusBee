# BusBee Commuters

A premium mobility platform for bus commuters, built with React Native and Expo Router. This app provides a seamless bus booking and tracking experience similar to Uber or Zomato, but focused specifically on bus transportation.

## Features

### 🚀 Onboarding & Authentication

- Beautiful animated splash screen with Lottie animations
- Premium onboarding carousel with gradient backgrounds
- User registration with name, email, and phone validation
- Secure login with email/password authentication
- Social login support (Google)

### 🏠 Home Dashboard

- Premium UI with gradient hero section
- Real-time bus search with from/to location inputs
- Quick action buttons for common tasks
- Recent routes for easy rebooking
- Feature highlights showcasing app benefits

### 🔍 Bus Search & Booking

- Advanced search with multiple filters (Express, Luxury, Economy)
- Real-time bus availability and pricing
- Seat selection and booking confirmation
- Multiple payment options

### 🎫 Booking Management

- Upcoming and past bookings with detailed information
- Booking status tracking (Confirmed, Completed, Cancelled)
- Digital ticket viewing and management
- Easy rebooking for frequent routes

### 👤 User Profile

- Editable profile with personal information
- Journey statistics (trips, miles, savings, carbon offset)
- Account settings and preferences
- Emergency contact management
- Secure logout functionality

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo Router** - File-based routing system
- **TypeScript** - Type-safe development
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **Lottie React Native** - Smooth animations
- **Expo Status Bar** - Status bar management

## Project Structure

```
BusBee-Commuters/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx (Home)
│   │   ├── search.tsx
│   │   ├── bookings.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx
│   └── index.tsx
├── src/
│   ├── components/
│   │   ├── SplashScreen.tsx
│   │   └── onboarding/
│   │       ├── OnboardingSlide.tsx
│   │       └── OnboardingCarousel.tsx
│   └── assets/
│       └── animations/
│           └── Bus_carga_trackMile.json
├── assets/
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
├── package.json
├── app.json
├── tsconfig.json
└── metro.config.js
```

## Installation

1. **Clone the repository**

   ```bash
   cd /Users/mac/Desktop/BusBee/BusBee-Commuters
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## App Flow

1. **Splash Screen** - Animated loading with BusBee branding
2. **Onboarding** - 4-slide carousel introducing app features
3. **Authentication** - Welcome screen with login/signup options
4. **Main App** - Tab-based navigation with Home, Search, Bookings, Profile

## Key Features Implemented

### Premium UI Design

- Gradient backgrounds throughout the app
- Consistent color scheme (#1A73E8 primary blue)
- Card-based layouts with shadows
- Smooth animations and transitions

### User Experience

- Intuitive navigation flow
- Form validation with user feedback
- Loading states and error handling
- Responsive design for different screen sizes

### Functionality

- User registration with name input (as requested)
- Mock authentication system
- Bus search and filtering
- Booking management
- Profile editing with statistics

## Customization

The app uses a consistent design system that can be easily customized:

- **Colors**: Primary blue (#1A73E8) and gradients
- **Typography**: System fonts with consistent sizing
- **Spacing**: 20px base unit for consistent layouts
- **Components**: Reusable components with TypeScript interfaces

## Next Steps

To make this a production-ready app, consider adding:

- Real backend API integration
- Push notifications for bus updates
- GPS tracking and maps integration
- Payment gateway integration
- Offline support for bookings
- Advanced search filters
- User reviews and ratings
- Multi-language support

## License

This project is part of the BusBee ecosystem for premium bus transportation services.
