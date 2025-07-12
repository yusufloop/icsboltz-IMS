import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { DesignSystem } from '@/constants/DesignSystem';

interface PremiumCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  animationDelay?: number;
}

export function PremiumCard({
  children,
  variant = 'default',
  padding = 'md',
  style,
  animationDelay = 0,
}: PremiumCardProps) {
  const getCardStyles = () => {
    const baseStyles = [styles.card];
    
    // Padding variants
    switch (padding) {
      case 'none':
        break;
      case 'sm':
        baseStyles.push(styles.paddingSm);
        break;
      case 'md':
        baseStyles.push(styles.paddingMd);
        break;
      case 'lg':
        baseStyles.push(styles.paddingLg);
        break;
    }
    
    // Style variants
    switch (variant) {
      case 'default':
        baseStyles.push(styles.default);
        break;
      case 'elevated':
        baseStyles.push(styles.elevated);
        break;
      case 'glass':
        baseStyles.push(styles.glass);
        break;
    }
    
    return baseStyles;
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(animationDelay).duration(DesignSystem.animation.duration.normal)}
      style={[getCardStyles(), style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: DesignSystem.components.borderRadius.xl,
    overflow: 'hidden',
  },
  
  // Padding variants
  paddingSm: {
    padding: DesignSystem.spacing.md,
  },
  paddingMd: {
    padding: DesignSystem.spacing.lg,
  },
  paddingLg: {
    padding: DesignSystem.spacing.xl,
  },
  
  // Style variants
  default: {
    backgroundColor: DesignSystem.colors.background.secondary,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.light,
    ...DesignSystem.components.shadows.sm,
  },
  
  elevated: {
    backgroundColor: DesignSystem.colors.background.secondary,
    ...DesignSystem.components.shadows.lg,
  },
  
  glass: {
    backgroundColor: DesignSystem.glassmorphism.background,
    borderWidth: 1,
    borderColor: DesignSystem.glassmorphism.borderColor,
    // Note: backdrop-blur would need to be implemented via native modules or CSS
  },
});