import { useState } from "react";
import { Alert } from "react-native";

// In a real app, you would get this from your auth context or user state
const MOCK_OWNER_ID = "user_owner_1a2b3c4d";

export default function useOwnerDashboard() {
  // The value to be encoded in the QR code
  const [qrValue] = useState<string>(MOCK_OWNER_ID);

  const handleShare = () => {
    // Optional: Add logic for other sharing methods
    Alert.alert("Share Profile", `Your unique ID is: ${qrValue}`);
  };

  return {
    qrValue,
    handleShare,
  };
}