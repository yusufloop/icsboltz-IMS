import { Stack } from 'expo-router';

export default function DemurrageLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="charge" />
    </Stack>
  );
}