import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { DesignSystem } from '@/constants/DesignSystem';

interface PremiumGlassCardProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: ViewStyle;
  animationDelay?: number;
}

export function PremiumGlassCard({
  children,
  intensity = 80,
  tint = 'light',
  style,
  animationDelay = 0,
}: PremiumGlassCardProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(animationDelay).duration(DesignSystem.animation.duration.normal)}
      style={[styles.container, style]}
    >
      <BlurView
        intensity={intensity}
        tint={tint}
        style={styles.blurContainer}
      >
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: DesignSystem.components.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DesignSystem.glassmorphism.borderColor,
  },
  
  blurContainer: {
    flex: 1,
  },
  
  content: {
    padding: DesignSystem.spacing.lg,
  },
});