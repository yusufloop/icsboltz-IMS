import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { DesignSystem } from '@/constants/DesignSystem';

interface PremiumInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  variant?: 'default' | 'filled';
}

export function PremiumInput({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  variant = 'default',
  style,
  onFocus,
  onBlur,
  ...props
}: PremiumInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnimation = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnimation.value = withTiming(1, {
      duration: DesignSystem.animation.duration.normal,
    });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusAnimation.value = withTiming(0, {
      duration: DesignSystem.animation.duration.normal,
    });
    onBlur?.(e);
  };

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnimation.value,
      [0, 1],
      [
        error ? DesignSystem.colors.destructive[500] : DesignSystem.colors.border.medium,
        error ? DesignSystem.colors.destructive[500] : DesignSystem.colors.primary[500]
      ]
    );

    return {
      borderColor,
      borderWidth: withTiming(isFocused ? 2 : 1, {
        duration: DesignSystem.animation.duration.fast,
      }),
    };
  });

  const getInputContainerStyles = () => {
    const baseStyles = [styles.inputContainer];
    
    if (variant === 'filled') {
      baseStyles.push(styles.filledVariant);
    }
    
    return baseStyles;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <Animated.View style={[getInputContainerStyles(), animatedBorderStyle]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[styles.input, style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={DesignSystem.colors.text.tertiary}
          selectionColor={DesignSystem.colors.primary[500]}
          {...props}
        />
        
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </Animated.View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {hint && !error && (
        <Text style={styles.hintText}>{hint}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: DesignSystem.spacing.lg,
  },
  
  label: {
    fontSize: DesignSystem.typography.sizes.sm,
    fontFamily: 'Inter-SemiBold',
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.sm,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.background.secondary,
    borderRadius: DesignSystem.components.borderRadius.lg,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.medium,
    minHeight: 48,
  },
  
  filledVariant: {
    backgroundColor: DesignSystem.colors.background.tertiary,
  },
  
  input: {
    flex: 1,
    fontSize: DesignSystem.typography.sizes.base,
    fontFamily: 'Inter-Regular',
    color: DesignSystem.colors.text.primary,
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.md,
    lineHeight: DesignSystem.typography.sizes.base * DesignSystem.typography.lineHeights.normal,
  },
  
  leftIconContainer: {
    paddingLeft: DesignSystem.spacing.lg,
    paddingRight: DesignSystem.spacing.sm,
  },
  
  rightIconContainer: {
    paddingRight: DesignSystem.spacing.lg,
    paddingLeft: DesignSystem.spacing.sm,
  },
  
  errorText: {
    fontSize: DesignSystem.typography.sizes.sm,
    fontFamily: 'Inter-Regular',
    color: DesignSystem.colors.destructive[500],
    marginTop: DesignSystem.spacing.xs,
  },
  
  hintText: {
    fontSize: DesignSystem.typography.sizes.sm,
    fontFamily: 'Inter-Regular',
    color: DesignSystem.colors.text.tertiary,
    marginTop: DesignSystem.spacing.xs,
  },
});