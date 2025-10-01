import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

export default function Button({
                                 title,
                                 onPress,
                                 disabled = false,
                                 variant = 'primary',
                                 size = 'medium',
                                 children
                               }: ButtonProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return '#6C63FF';
      case 'secondary':
        return '#4B7BEC';
      case 'outline':
        return 'transparent';
      default:
        return '#6C63FF';
    }
  };

  const getTextColor = () => {
    return variant === 'outline' ? '#6C63FF' : '#fff';
  };

  const getBorder = () => {
    return variant === 'outline' ? { borderWidth: 2, borderColor: '#6C63FF' } : {};
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 10 };
      case 'medium':
        return { paddingVertical: 14 };
      case 'large':
        return { paddingVertical: 16 };
      default:
        return { paddingVertical: 14 };
    }
  };

  return (
      <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: getBackgroundColor() },
            getBorder(),
            getSize(),
            disabled && styles.buttonDisabled
          ]}
          onPress={onPress}
          disabled={disabled}
      >
        {children ? (
            children
        ) : (
            <Text style={[styles.buttonText, { color: getTextColor() }]}>
              {title}
            </Text>
        )}
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700"
  },
});