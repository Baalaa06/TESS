import { auth } from "@/config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

const FALLBACK_USERS_KEY = "__demo_users__";
const FALLBACK_CURRENT_USER = "__demo_current_user__";

async function fallbackRegister(email: string, password: string) {
  const raw = await AsyncStorage.getItem(FALLBACK_USERS_KEY);
  const users = raw ? JSON.parse(raw) : {};
  if (users[email]) throw new Error("User already exists (demo fallback)");
  users[email] = { email, password };
  await AsyncStorage.setItem(FALLBACK_USERS_KEY, JSON.stringify(users));
  // auto-login demo user after registration
  await AsyncStorage.setItem(FALLBACK_CURRENT_USER, JSON.stringify({ email }));
  return { email };
}

async function fallbackLogin(email: string, password: string) {
  const raw = await AsyncStorage.getItem(FALLBACK_USERS_KEY);
  const users = raw ? JSON.parse(raw) : {};
  const u = users[email];
  if (!u || u.password !== password) throw new Error("Invalid credentials (demo fallback)");
  await AsyncStorage.setItem(FALLBACK_CURRENT_USER, JSON.stringify({ email }));
  return { email };
}

export async function registerWithEmail(email: string, password: string) {
  if (auth) {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      return credential.user;
    } catch (err: any) {
      console.error("Firebase register error:", err.code || err.message, err);
      // If Firebase Auth isn't configured for this project (common when Email/Password
      // provider is disabled or using mismatched SDKs), fallback to demo storage.
      const code = err && (err.code || "");
      const msg = err && (err.message || "");
      if (code === "auth/configuration-not-found" || msg.includes("configuration-not-found")) {
        console.warn("Falling back to demo auth because Firebase Auth is not configured.");
        return fallbackRegister(email, password);
      }
      throw new Error(code ? `${code}: ${msg}` : msg || "Firebase registration failed");
    }
  }
  return fallbackRegister(email, password);
}

export async function loginWithEmail(email: string, password: string) {
  if (auth) {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user;
    } catch (err: any) {
      console.error("Firebase login error:", err.code || err.message, err);
      const code = err && (err.code || "");
      const msg = err && (err.message || "");
      if (code === "auth/configuration-not-found" || msg.includes("configuration-not-found")) {
        console.warn("Falling back to demo auth because Firebase Auth is not configured.");
        return fallbackLogin(email, password);
      }
      throw new Error(code ? `${code}: ${msg}` : msg || "Firebase login failed");
    }
  }
  return fallbackLogin(email, password);
}

export async function logout() {
  if (auth) return signOut(auth);
  // clear demo session
  return AsyncStorage.removeItem(FALLBACK_CURRENT_USER);
}

export function getCurrentUser() {
  return auth ? auth.currentUser : null;
}
