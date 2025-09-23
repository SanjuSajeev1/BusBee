import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Text, Platform, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function UserLocationScreen() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const webViewRef = useRef<WebView | null>(null);
  const [followUser, setFollowUser] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        setIsLoading(false);
        return;
      }

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => {
          const coords = {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            accuracy: loc.coords.accuracy || 0,
            follow: followUser,
          };
          setCurrentLocation({
            lat: coords.lat,
            lng: coords.lng,
            accuracy: coords.accuracy,
          });
          webViewRef.current?.postMessage(JSON.stringify(coords));
          setIsLoading(false);

          // Do not auto-return; wait for user to tap Select Location
        }
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, [followUser]);

  const leafletHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <style>
          body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Basic error logging back to RN
          function rnLog(msg) {
            try { window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', msg })); } catch (e) {}
          }

          var map = L.map('map', { zoomControl: false }).setView([9.9312, 76.2673], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          var userMarker = L.marker([9.9312, 76.2673]).addTo(map);
          var accuracyCircle = L.circle([9.9312, 76.2673], {
            radius: 50,
            color: '#1E90FF',
            fillColor: '#1E90FF',
            fillOpacity: 0.2
          }).addTo(map);

          function handleMessage(event) {
            var data = JSON.parse(event.data);

            userMarker.setLatLng([data.lat, data.lng]);
            accuracyCircle.setLatLng([data.lat, data.lng]);
            accuracyCircle.setRadius(data.accuracy);

            if (data.follow) {
              map.setView([data.lat, data.lng]);
            }
          }

          // Support both window and document listeners for different platforms
          if (typeof window !== 'undefined') {
            window.addEventListener('message', handleMessage);
          }
          if (typeof document !== 'undefined') {
            document.addEventListener('message', handleMessage);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#1A73E8" translucent={false} />

      {/* Header with Gradient */}
      <LinearGradient
        colors={["#1A73E8", "#4285F4"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerSubtitle}>
              {isLoading ? "Getting your location..." : "Tap to select this location"}
            </Text>
          </View>

          {currentLocation && (
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                if (returnTo === "location-picker") {
                  router.replace({
                    pathname: "/(tabs)",
                    params: {
                      selectedLocation: JSON.stringify({
                        id: "current",
                        name: "Current Location",
                        subtitle: `Lat: ${currentLocation.lat.toFixed(6)}, Lng: ${currentLocation.lng.toFixed(6)}`,
                        icon: "📍",
                        coordinates: currentLocation
                      })
                    }
                  });
                } else {
                  router.back();
                }
              }}
            >
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#1A73E8" />
            <Text style={styles.loadingText}>Getting your location...</Text>
          </View>
        )}
        
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: leafletHtml }}
          style={styles.webView}
          javaScriptEnabled
          domStorageEnabled
          setSupportMultipleWindows={false}
          mixedContentMode="always"
          startInLoadingState
          renderLoading={() => (
            <View style={styles.mapLoadingContainer}>
              <ActivityIndicator size="large" color="#1A73E8" />
              <Text style={styles.mapLoadingText}>Loading map...</Text>
            </View>
          )}
          onError={(e) => {
            console.warn('WebView error', e.nativeEvent);
          }}
          onHttpError={(e) => {
            console.warn('WebView HTTP error', e.nativeEvent);
          }}
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setFollowUser(!followUser)}
      >
        <LinearGradient
          colors={followUser ? ["#34A853", "#0F9D58"] : ["#1A73E8", "#4285F4"]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.fabIcon}>
            {followUser ? "🔒" : "📍"}
          </Text>
          <Text style={styles.fabText}>
            {followUser ? "Unlock Map" : "Follow Me"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Location Info Card */}
      {currentLocation && (
        <View style={styles.locationInfoCard}>
          <View style={styles.locationInfoContent}>
            <Text style={styles.locationInfoTitle}>📍 Current Location</Text>
            <Text style={styles.locationInfoText}>
              Lat: {currentLocation.lat.toFixed(6)}
            </Text>
            <Text style={styles.locationInfoText}>
              Lng: {currentLocation.lng.toFixed(6)}
            </Text>
            <Text style={styles.locationInfoText}>
              Accuracy: ±{Math.round(currentLocation.accuracy)}m
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
    marginTop: 4,
  },
  selectButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(248, 249, 250, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#1A73E8",
    fontWeight: "600",
  },
  webView: {
    flex: 1,
  },
  mapLoadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
  mapLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#1A73E8",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 30,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  fabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  fabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  locationInfoCard: {
    position: "absolute",
    bottom: 140,
    left: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  locationInfoContent: {
    alignItems: "center",
  },
  locationInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  locationInfoText: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 2,
  },
});

