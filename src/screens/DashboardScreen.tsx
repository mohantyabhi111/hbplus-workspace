import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { styles } from "../ui/styles";

export function DashboardScreen() {
  const { user, role, logout } = useAuth();
  return (
    <View style={styles.dashboard}>
      <View style={styles.topbar}>
        <View style={styles.brandRow}><View style={styles.smallLogo}><Text style={styles.logoText}>HB</Text></View><Text style={styles.brand}>HB Plus</Text></View>
        <Pressable onPress={() => void logout()} style={styles.logout}><Text style={styles.logoutText}>Sign out</Text></Pressable>
      </View>
      <View style={styles.dashboardContent}>
        <Text style={styles.eyebrow}>WORKSPACE</Text>
        <Text style={styles.dashboardTitle}>Your dashboard</Text>
        <Text style={styles.subheading}>You are signed in with an authorized account.</Text>
        <View style={styles.profileCard}>
          {user?.photoURL ? <Image source={{ uri: user.photoURL }} style={styles.avatar} /> : <View style={styles.avatarFallback}><Text style={styles.avatarInitial}>{(user?.displayName || user?.email || "U")[0].toUpperCase()}</Text></View>}
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{user?.displayName || "HB Plus member"}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <View style={styles.rolePill}><Text style={styles.roleText}>{role.toUpperCase()}</Text></View>
        </View>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>You’re all set.</Text>
          <Text style={styles.welcomeBody}>Your account has passed the organization domain check. Protected workspace content can be added here.</Text>
        </View>
      </View>
    </View>
  );
}
