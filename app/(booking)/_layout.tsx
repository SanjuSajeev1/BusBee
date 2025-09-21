import { Stack } from "expo-router";

export default function BookingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "card",
      }}
    >
      <Stack.Screen name="bus-selection" />
      <Stack.Screen name="seat-selection" />
      <Stack.Screen name="passenger-details" />
      <Stack.Screen name="booking-confirmation" />
    </Stack>
  );
}
