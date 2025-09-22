import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Camera } from "expo-camera";

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [requesting, setRequesting] = useState(false);

  const requestCameraPermissionAndNavigate = async () => {
    setRequesting(true);
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        navigation.navigate("QRScanner");
      } else {
        Alert.alert("Camera Access Required", "Please grant camera permission to scan boarding passes and documents.");
      }
    } catch (error) {
      Alert.alert("Permission Error", "Unable to request camera permission. Please try again.");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* App Branding */}
      <View style={styles.headerSection}>
        <Text style={styles.appTitle}>BoardingMate</Text>
        <Text style={styles.tagline}>Your companion for boarding</Text>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome aboard!</Text>
        <Text style={styles.subtitle}>
          Scan boarding passes, verify locations, and travel with confidence
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonSection}>
        {/* Primary Action - Scan Boarding Pass */}
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryButtonGradient}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={requestCameraPermissionAndNavigate}
            activeOpacity={0.9}
            disabled={requesting}
          >
            <Text style={styles.primaryButtonText}>
              {requesting ? "Preparing Scanner..." : "📱 Boarding Scan"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Secondary Action - Location Services */}
        <LinearGradient
          colors={["#11998e", "#38ef7d"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.secondaryButtonGradient}
        >
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("LocationCheck")}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryButtonText}>🌍 Verify Location</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>Seamless travel starts here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafe",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  
  appTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#2d3748",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  
  tagline: {
    fontSize: 16,
    color: "#718096",
    fontWeight: "500",
    marginTop: 8,
    fontStyle: "italic",
  },
  
  welcomeSection: {
    alignItems: "center",
    marginBottom: 60,
  },
  
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: 12,
  },
  
  subtitle: {
    fontSize: 16,
    color: "#4a5568",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  
  buttonSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  
  // Primary button (optimal 60px height for Android)
  primaryButtonGradient: {
    width: Math.min(width - 48, 320), // Max 320px, responsive
    height: 60, // Optimal button height per research
    borderRadius: 30,
    marginBottom: 20,
    ...Platform.select({
      android: {
        elevation: 12,
      },
      ios: {
        shadowColor: "#667eea",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
      },
    }),
  },
  
  primaryButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  
  // Secondary button (optimal 48px height for secondary actions)
  secondaryButtonGradient: {
    width: Math.min(width - 48, 320),
    height: 48, // Slightly smaller for secondary action
    borderRadius: 24,
    ...Platform.select({
      android: {
        elevation: 8,
      },
      ios: {
        shadowColor: "#11998e",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
    }),
  },
  
  secondaryButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#a0aec0",
    fontWeight: "500",
    marginTop: "auto",
  },
});

export default HomeScreen;
