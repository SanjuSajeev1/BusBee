import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    // Set a timer for 3 seconds
    const timer = setTimeout(() => {
      setAnimationFinished(true);
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <LinearGradient
      colors={["#1A73E8", "#4285F4", "#34A853"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <LottieView
          source={require("../assets/animations/Bus_carga_trackMile.json")}
          autoPlay
          loop
          speed={2.5}
          style={styles.animation}
          onAnimationFinish={() => {
            // Optional: Handle animation finish if needed
          }}
        />
        <Text style={styles.brandText}>BusBee</Text>
        <Text style={styles.taglineText}>Your Premium Bus Experience</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: width * 0.6,
    height: height * 0.4,
  },
  brandText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  taglineText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 8,
    opacity: 0.9,
    textAlign: "center",
  },
});
