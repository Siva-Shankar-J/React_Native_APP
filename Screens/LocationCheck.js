// LocationCheck.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import * as Location from "expo-location";

// Fixed geofence coordinates for Delhi Airport
const DELHI_AIRPORT = { latitude: 28.5562, longitude: 77.1000 };

// Haversine formula to compute distance (km) between two lat/lon points
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const LocationCheck = () => {
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [zoneMsg, setZoneMsg] = useState("");

  // Function to check user's current location and set zone message based on geofence
  const handleLocationCheck = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude: lat, longitude: lon } = loc.coords;
      setLatitude(lat);
      setLongitude(lon);

      const distance = getDistanceKm(
        lat,
        lon,
        DELHI_AIRPORT.latitude,
        DELHI_AIRPORT.longitude
      );
      setZoneMsg(
        distance <= 2
          ? "Inside Airport Zone ■"
          : "Outside Airport Zone ■"
      );
    } catch (error) {
      Alert.alert("Error", "Failed to get location: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Professional, clear introductory text */}
      <Text style={styles.introText}>
        Confirm your current location effortlessly.
        Check below if you’re within 2km of Delhi Airport. 
        Location access is secure and private.
      </Text>

      {/* Screen header */}
      <Text style={styles.header}>Location Check</Text>

      {/* Action button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLocationCheck}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Location</Text>
        )}
      </TouchableOpacity>

      {/* Display results */}
      {latitude !== null && (
        <View style={styles.infoCard}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{latitude.toFixed(6)}</Text>
          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{longitude.toFixed(6)}</Text>
          <Text
            style={[
              styles.zoneText,
              zoneMsg.includes("Inside") ? styles.inside : styles.outside,
            ]}
          >
            {zoneMsg}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#E5EEF8", // light bluish background
    justifyContent: "center",
    alignItems: "center",
  },
  introText: {
    fontSize: 18,
    color: "#496d90ff",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 26,
  },
  header: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 32,
  },
  button: {
    width: 280,
    height: 56,
    backgroundColor: "#3B82F6", // professional blue shade
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    ...Platform.select({
      android: { elevation: 6 },
      ios: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
    }),
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD", // lighter blue when disabled
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: "#4B5563",
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  zoneText: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
  },
  inside: { color: "#2ebf8eff" },
  outside: { color: "#d55656ff" },
});

export default LocationCheck;
