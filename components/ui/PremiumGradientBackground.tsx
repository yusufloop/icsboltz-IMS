import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignSystem } from '@/constants/DesignSystem';

interface PremiumGradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'decorative' | 'highlight' | 'success' | 'primary';
  style?: ViewStyle;
}

export function PremiumGradientBackground({
  children,
  variant = 'decorative',
  style,
}: PremiumGradientBackgroundProps) {
  const getGradientConfig = () => {
    switch (variant) {
      case 'decorative':
        return DesignSystem.gradients.decorativeBackground;
      case 'highlight':
        return DesignSystem.gradients.highlight;
      case 'success':
        return DesignSystem.gradients.success;
      case 'primary':
        return DesignSystem.gradients.primaryAction;
      default:
        return DesignSystem.gradients.decorativeBackground;
    }
  };

  const gradientConfig = getGradientConfig();

  return (
    <LinearGradient
      colors={gradientConfig.colors}
      start={gradientConfig.start}
      end={gradientConfig.end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});