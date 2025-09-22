import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

const QRScanner = () => {
  const isFocused = useIsFocused();  // Track screen focus state
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionMessage}>
          Camera permission is required to scan QR codes
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} color="#007AFF" />
      </View>
    );
  }

  const handleScan = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert("Scanned Data", `${data}`);
      setTimeout(() => setScanned(false), 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: [
              "qr",
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code39",
              "code128",
            ],
          }}
          onBarcodeScanned={handleScan}
        />
      )}
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  permissionMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  camera: { flex: 1 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 15,
  },
});

export default QRScanner;
