import { Pressable, Text } from "react-native";

export function HapticTab({ label }: { label: string }) {
  return (
    <Pressable>
      <Text>{label}</Text>
    </Pressable>
  );
}
