import React from 'react';
import { ActivityIndicator } from 'react-native';
import CustomButton from './CustomButton';

interface LoadingButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingButton(
    {
      title,
      onPress,
      loading = false,
      disabled = false,
      variant = 'primary',
      size = 'medium'
    }: LoadingButtonProps) {
  if (loading) {
    return (
        <CustomButton
            title=""
            onPress={onPress}
            disabled={true}
            variant={variant}
            size={size}
        >
          <ActivityIndicator color="#fff" />
        </CustomButton>
    );
  }

  return (
      <CustomButton
          title={title}
          onPress={onPress}
          disabled={disabled}
          variant={variant}
          size={size}
      />
  );
}