import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { config } from "../config/env";
import { signInWithGoogle } from "./googleSignIn";

type AppRole = "admin" | "user";
type AuthContextValue = {
  user: User | null;
  role: AppRole;
  loading: boolean;
  signingIn: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isAllowed(user: User) {
  const email = user.email?.trim().toLowerCase() || "";
  return user.emailVerified && email.endsWith(`@${config.allowedDomain}`);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>("user");
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null); setRole("user"); setLoading(false); return;
    }
    if (!isAllowed(firebaseUser)) {
      await signOut(auth);
      setUser(null); setRole("user");
      setError("Access restricted. Please login using your official domain email.");
      setLoading(false);
      return;
    }
    setUser(firebaseUser);
    try {
      const roleDoc = await getDoc(doc(db, "roles", firebaseUser.uid));
      setRole(roleDoc.exists() && roleDoc.data().role === "admin" ? "admin" : "user");
    } catch {
      setRole("user");
    }
    setLoading(false);
  }), []);

  const login = async () => {
    setSigningIn(true); setError(null);
    try {
      const signedInUser = await signInWithGoogle();
      if (!isAllowed(signedInUser)) {
        await signOut(auth);
        setError("Access restricted. Please login using your official domain email.");
        return;
      }
      await setDoc(doc(db, "users", signedInUser.uid), {
        uid: signedInUser.uid,
        email: signedInUser.email,
        displayName: signedInUser.displayName,
        photoURL: signedInUser.photoURL,
        lastLoginAt: serverTimestamp()
      }, { merge: true });
    } catch (e: any) {
      setError(e?.code === "auth/popup-closed-by-user"
        ? "The Google sign-in window was closed."
        : e?.message || "Unable to sign in. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  const logout = async () => { await signOut(auth); setUser(null); setRole("user"); };
  const value = useMemo(() => ({ user, role, loading, signingIn, error, login, logout, clearError: () => setError(null) }),
    [user, role, loading, signingIn, error]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
