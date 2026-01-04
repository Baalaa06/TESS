import NetInfo from "@react-native-community/netinfo";

export async function getNetworkScore() {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return 0.2;
  if (state.isInternetReachable) return 1.0;
  return 0.5;
}
