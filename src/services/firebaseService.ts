import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";

export async function sendEmergencyAlert(data: any) {
  await firestore().collection("alerts").add({
    ...data,
    timestamp: Date.now(),
  });
}
