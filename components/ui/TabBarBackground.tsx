import React from 'react';
import { View } from 'react-native';

// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  return <View />;
}

export function useBottomTabOverflow() {
  return 0;
}