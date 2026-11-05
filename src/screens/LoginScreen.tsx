import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { config } from "../config/env";
import { styles } from "../ui/styles";

export function LoginScreen() {
  const { login, signingIn, error, clearError } = useAuth();
  return (
    <View style={styles.page}>
      <View style={styles.loginCard}>
        <View style={styles.logo}><Text style={styles.logoText}>HB</Text></View>
        <Text style={styles.eyebrow}>HB PLUS WORKSPACE</Text>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>Sign in with your official account to continue to your workspace.</Text>
        <View style={styles.domainPill}><Text style={styles.domainText}>Authorized domain: @{config.allowedDomain}</Text></View>
        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          disabled={signingIn}
          onPress={() => { clearError(); void login(); }}
          style={({ pressed }) => [styles.googleButton, pressed && styles.pressed, signingIn && styles.disabled]}
        >
          {signingIn ? <ActivityIndicator color="#111827" /> : <>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </>}
        </Pressable>
        <Text style={styles.footnote}>Access is limited to verified @{config.allowedDomain} accounts.</Text>
      </View>
      <Text style={styles.copyright}>© {new Date().getFullYear()} HB Plus · Secure workspace</Text>
    </View>
  );
}
