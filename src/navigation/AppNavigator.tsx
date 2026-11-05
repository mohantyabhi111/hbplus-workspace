import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { LoginScreen } from "../screens/LoginScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { styles } from "../ui/styles";

export function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563EB" /></View>;
  return user ? <DashboardScreen /> : <LoginScreen />;
}
