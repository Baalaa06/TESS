import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, isFirebaseEnabled } from "../config/firebase";
import { collection, addDoc, getDocs, orderBy, query, limit } from 'firebase/firestore';

const CONTEXT_KEY = "CONTEXT_EVENTS";
const INCIDENTS_KEY = "INCIDENT_LOGS";

// Context event storage
export async function saveContext(event) {
  try {
    if (isFirebaseEnabled) {
      await addDoc(collection(db, 'contexts'), {
        ...event,
        timestamp: Date.now()
      });
    } else {
      // Local fallback
      const existing = await AsyncStorage.getItem(CONTEXT_KEY);
      const events = existing ? JSON.parse(existing) : [];
      
      events.push({ ...event, timestamp: Date.now() });
      
      if (events.length > 50) {
        events.splice(0, events.length - 50);
      }
      
      await AsyncStorage.setItem(CONTEXT_KEY, JSON.stringify(events));
    }
  } catch (error) {
    console.warn('Failed to save context:', error);
    // Always fallback to local storage on error
    try {
      const existing = await AsyncStorage.getItem(CONTEXT_KEY);
      const events = existing ? JSON.parse(existing) : [];
      events.push({ ...event, timestamp: Date.now() });
      if (events.length > 50) events.splice(0, events.length - 50);
      await AsyncStorage.setItem(CONTEXT_KEY, JSON.stringify(events));
    } catch (localError) {
      console.warn('Local fallback also failed:', localError);
    }
  }
}

export async function getContexts() {
  try {
    if (isFirebaseEnabled) {
      const q = query(collection(db, 'contexts'), orderBy('timestamp', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      // Local fallback
      const data = await AsyncStorage.getItem(CONTEXT_KEY);
      return data ? JSON.parse(data) : [];
    }
  } catch (error) {
    console.warn('Failed to get contexts:', error);
    // Always fallback to local storage on error
    try {
      const data = await AsyncStorage.getItem(CONTEXT_KEY);
      return data ? JSON.parse(data) : [];
    } catch (localError) {
      console.warn('Local fallback also failed:', localError);
      return [];
    }
  }
}

// Incident log storage
export async function saveIncident(incident) {
  try {
    if (isFirebaseEnabled) {
      await addDoc(collection(db, 'incidents'), {
        ...incident,
        id: Date.now()
      });
    } else {
      // Local fallback
      const existing = await AsyncStorage.getItem(INCIDENTS_KEY);
      const incidents = existing ? JSON.parse(existing) : [];
      
      incidents.unshift({ ...incident, id: Date.now() });
      
      if (incidents.length > 100) {
        incidents.splice(100);
      }
      
      await AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
    }
  } catch (error) {
    console.warn('Failed to save incident:', error);
    // Always fallback to local storage on error
    try {
      const existing = await AsyncStorage.getItem(INCIDENTS_KEY);
      const incidents = existing ? JSON.parse(existing) : [];
      incidents.unshift({ ...incident, id: Date.now() });
      if (incidents.length > 100) incidents.splice(100);
      await AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
    } catch (localError) {
      console.warn('Local fallback also failed:', localError);
    }
  }
}

export async function getIncidents() {
  try {
    if (isFirebaseEnabled) {
      const q = query(collection(db, 'incidents'), orderBy('timestamp', 'desc'), limit(100));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      // Local fallback
      const data = await AsyncStorage.getItem(INCIDENTS_KEY);
      return data ? JSON.parse(data) : [];
    }
  } catch (error) {
    console.warn('Failed to get incidents:', error);
    // Always fallback to local storage on error
    try {
      const data = await AsyncStorage.getItem(INCIDENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (localError) {
      console.warn('Local fallback also failed:', localError);
      return [];
    }
  }
}
