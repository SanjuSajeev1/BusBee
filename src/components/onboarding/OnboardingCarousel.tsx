import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import OnboardingSlide from "./OnboardingSlide";

const { width } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    title: "Welcome to BusBee",
    subtitle: "Premium Bus Travel",
    description:
      "Experience luxury and comfort with our premium bus services. Travel in style with real-time tracking and seamless booking.",
    backgroundColor: ["#1A73E8", "#4285F4"],
  },
  {
    id: 2,
    title: "Real-Time Tracking",
    subtitle: "Never Miss Your Bus",
    description:
      "Track your bus in real-time, get accurate arrival times, and plan your journey with confidence.",
    backgroundColor: ["#4285F4", "#34A853"],
  },
  {
    id: 3,
    title: "Smart Booking",
    subtitle: "Book with Ease",
    description:
      "Quick and secure booking with multiple payment options. Reserve your seat and travel worry-free.",
    backgroundColor: ["#34A853", "#FBBC04"],
  },
  {
    id: 4,
    title: "Premium Experience",
    subtitle: "Comfort Redefined",
    description:
      "Enjoy premium amenities, comfortable seating, and excellent service on every journey.",
    backgroundColor: ["#FBBC04", "#EA4335"],
  },
];

export default function OnboardingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { completeOnboarding } = useAuth();

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  const goToNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      // Complete onboarding and navigate to auth
      await completeOnboarding();
      router.push("/(auth)/welcome");
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true,
      });
      setCurrentIndex(prevIndex);
    }
  };

  const skip = async () => {
    await completeOnboarding();
    router.push("/(auth)/welcome");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {onboardingData.map((slide) => (
          <OnboardingSlide
            key={slide.id}
            title={slide.title}
            subtitle={slide.subtitle}
            description={slide.description}
            backgroundColor={slide.backgroundColor}
          />
        ))}
      </ScrollView>

      {/* Navigation Controls */}
      <View style={styles.controls}>
        {/* Skip Button */}
        <TouchableOpacity onPress={skip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Page Indicators */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  opacity: index === currentIndex ? 1 : 0.3,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Next/Previous Buttons */}
        <View style={styles.navigationButtons}>
          {currentIndex > 0 && (
            <TouchableOpacity onPress={goToPrevious} style={styles.navButton}>
              <Text style={styles.navButtonText}>←</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={goToNext} style={styles.nextButton}>
            <LinearGradient
              colors={["#FFFFFF", "#F0F0F0"]}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === onboardingData.length - 1
                  ? "Get Started"
                  : "→"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: "#FFFFFF",
    fontSize: 16,
    opacity: 0.8,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
  },
  paginationDot: {
    height: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navigationButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  navButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  nextButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  nextButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#1A73E8",
    fontSize: 16,
    fontWeight: "bold",
  },
});
