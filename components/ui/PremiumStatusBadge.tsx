import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { DesignSystem } from '@/constants/DesignSystem';

interface PremiumStatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  text: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outlined' | 'soft';
  style?: ViewStyle;
}

export function PremiumStatusBadge({
  status,
  text,
  size = 'md',
  variant = 'soft',
  style,
}: PremiumStatusBadgeProps) {
  const getStatusColors = () => {
    switch (status) {
      case 'success':
        return {
          filled: {
            background: DesignSystem.colors.status.success,
            text: DesignSystem.colors.text.inverse,
            border: DesignSystem.colors.status.success,
          },
          outlined: {
            background: 'transparent',
            text: DesignSystem.colors.status.success,
            border: DesignSystem.colors.status.success,
          },
          soft: {
            background: `${DesignSystem.colors.status.success}20`,
            text: DesignSystem.colors.status.success,
            border: 'transparent',
          },
        };
      case 'warning':
        return {
          filled: {
            background: DesignSystem.colors.status.warning,
            text: DesignSystem.colors.text.inverse,
            border: DesignSystem.colors.status.warning,
          },
          outlined: {
            background: 'transparent',
            text: DesignSystem.colors.status.warning,
            border: DesignSystem.colors.status.warning,
          },
          soft: {
            background: `${DesignSystem.colors.status.warning}20`,
            text: DesignSystem.colors.status.warning,
            border: 'transparent',
          },
        };
      case 'error':
        return {
          filled: {
            background: DesignSystem.colors.status.error,
            text: DesignSystem.colors.text.inverse,
            border: DesignSystem.colors.status.error,
          },
          outlined: {
            background: 'transparent',
            text: DesignSystem.colors.status.error,
            border: DesignSystem.colors.status.error,
          },
          soft: {
            background: `${DesignSystem.colors.status.error}20`,
            text: DesignSystem.colors.status.error,
            border: 'transparent',
          },
        };
      case 'info':
        return {
          filled: {
            background: DesignSystem.colors.primary[500],
            text: DesignSystem.colors.text.inverse,
            border: DesignSystem.colors.primary[500],
          },
          outlined: {
            background: 'transparent',
            text: DesignSystem.colors.primary[500],
            border: DesignSystem.colors.primary[500],
          },
          soft: {
            background: `${DesignSystem.colors.primary[500]}20`,
            text: DesignSystem.colors.primary[500],
            border: 'transparent',
          },
        };
      case 'neutral':
      default:
        return {
          filled: {
            background: DesignSystem.colors.text.secondary,
            text: DesignSystem.colors.text.inverse,
            border: DesignSystem.colors.text.secondary,
          },
          outlined: {
            background: 'transparent',
            text: DesignSystem.colors.text.secondary,
            border: DesignSystem.colors.text.secondary,
          },
          soft: {
            background: `${DesignSystem.colors.text.secondary}20`,
            text: DesignSystem.colors.text.secondary,
            border: 'transparent',
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.smContainer,
          text: styles.smText,
        };
      case 'lg':
        return {
          container: styles.lgContainer,
          text: styles.lgText,
        };
      case 'md':
      default:
        return {
          container: styles.mdContainer,
          text: styles.mdText,
        };
    }
  };

  const colors = getStatusColors()[variant];
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: variant === 'outlined' ? 1 : 0,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          sizeStyles.text,
          { color: colors.text },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: DesignSystem.components.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Size variants
  smContainer: {
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: DesignSystem.spacing.xs,
    minHeight: 20,
  },
  mdContainer: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.xs,
    minHeight: 24,
  },
  lgContainer: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.sm,
    minHeight: 32,
  },
  
  // Text styles
  text: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  
  smText: {
    fontSize: DesignSystem.typography.sizes.xs,
  },
  mdText: {
    fontSize: DesignSystem.typography.sizes.sm,
  },
  lgText: {
    fontSize: DesignSystem.typography.sizes.base,
  },
});