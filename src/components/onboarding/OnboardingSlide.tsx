import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface OnboardingSlideProps {
  title: string;
  subtitle: string;
  description: string;
  image?: any;
  backgroundColor: string[];
}

export default function OnboardingSlide({
  title,
  subtitle,
  description,
  image,
  backgroundColor,
}: OnboardingSlideProps) {
  return (
    <LinearGradient colors={backgroundColor} style={styles.container}>
      <View style={styles.content}>
        {image && (
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.image} resizeMode="contain" />
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: width * 0.7,
    height: height * 0.35,
  },
  textContainer: {
    flex: 0.4,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.9,
  },
  description: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 10,
  },
});
