import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { DesignSystem } from '@/constants/DesignSystem';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface PremiumButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function PremiumButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: PremiumButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(DesignSystem.animation.pressScale, {
      duration: DesignSystem.animation.duration.fast,
    });
    opacity.value = withTiming(DesignSystem.animation.opacity.pressed, {
      duration: DesignSystem.animation.duration.fast,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      duration: DesignSystem.animation.duration.fast,
    });
    opacity.value = withTiming(1, {
      duration: DesignSystem.animation.duration.fast,
    });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      runOnJS(onPress)();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getButtonStyles = () => {
    const baseStyles = [styles.button, styles[size]];
    
    if (disabled || loading) {
      baseStyles.push(styles.disabled);
    }

    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primary);
        break;
      case 'secondary':
        baseStyles.push(styles.secondary);
        break;
      case 'destructive':
        baseStyles.push(styles.destructive);
        break;
      case 'ghost':
        baseStyles.push(styles.ghost);
        break;
      case 'gradient':
        // Gradient styling handled by LinearGradient component
        baseStyles.push(styles.gradient);
        break;
    }

    return baseStyles;
  };

  const getTextStyles = () => {
    const baseTextStyles = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        baseTextStyles.push(styles.primaryText);
        break;
      case 'secondary':
        baseTextStyles.push(styles.secondaryText);
        break;
      case 'destructive':
        baseTextStyles.push(styles.destructiveText);
        break;
      case 'ghost':
        baseTextStyles.push(styles.ghostText);
        break;
      case 'gradient':
        baseTextStyles.push(styles.gradientText);
        break;
    }

    return baseTextStyles;
  };

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'secondary' || variant === 'ghost' ? DesignSystem.colors.primary[500] : DesignSystem.colors.text.inverse}
          style={styles.loader}
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <>{icon}</>
      )}
      <Text style={[getTextStyles(), textStyle]}>
        {title}
      </Text>
      {!loading && icon && iconPosition === 'right' && (
        <>{icon}</>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <AnimatedTouchableOpacity
        style={[animatedStyle, style]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        <LinearGradient
          colors={DesignSystem.gradients.primaryAction.colors}
          start={DesignSystem.gradients.primaryAction.start}
          end={DesignSystem.gradients.primaryAction.end}
          style={getButtonStyles()}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedTouchableOpacity>
    );
  }

  return (
    <AnimatedTouchableOpacity
      style={[animatedStyle, getButtonStyles(), style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {renderContent()}
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DesignSystem.components.borderRadius.lg,
    ...DesignSystem.components.shadows.sm,
  },
  
  // Size variants
  sm: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.sm,
    minHeight: 36,
    gap: DesignSystem.spacing.xs,
  },
  md: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.md,
    minHeight: 44,
    gap: DesignSystem.spacing.sm,
  },
  lg: {
    paddingHorizontal: DesignSystem.spacing.xl,
    paddingVertical: DesignSystem.spacing.lg,
    minHeight: 52,
    gap: DesignSystem.spacing.sm,
  },
  
  // Style variants
  primary: {
    backgroundColor: DesignSystem.colors.primary[500],
  },
  secondary: {
    backgroundColor: DesignSystem.colors.background.secondary,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.medium,
  },
  destructive: {
    backgroundColor: DesignSystem.colors.destructive[500],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  gradient: {
    backgroundColor: 'transparent',
  },
  
  disabled: {
    opacity: DesignSystem.animation.opacity.disabled,
  },
  
  // Text styles
  text: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  
  smText: {
    fontSize: DesignSystem.typography.sizes.sm,
  },
  mdText: {
    fontSize: DesignSystem.typography.sizes.base,
  },
  lgText: {
    fontSize: DesignSystem.typography.sizes.lg,
  },
  
  primaryText: {
    color: DesignSystem.colors.text.inverse,
  },
  secondaryText: {
    color: DesignSystem.colors.text.primary,
  },
  destructiveText: {
    color: DesignSystem.colors.text.inverse,
  },
  ghostText: {
    color: DesignSystem.colors.primary[500],
  },
  gradientText: {
    color: DesignSystem.colors.text.inverse,
  },
  
  loader: {
    marginRight: DesignSystem.spacing.xs,
  },
});