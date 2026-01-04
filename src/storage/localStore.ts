import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "CONTEXT_EVENTS";

export async function saveContext(event: any) {
  const old = await AsyncStorage.getItem(KEY);
  const events = old ? JSON.parse(old) : [];

  events.push(event);
  if (events.length > 20) events.shift();

  await AsyncStorage.setItem(KEY, JSON.stringify(events));
}

export async function getContexts() {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}
