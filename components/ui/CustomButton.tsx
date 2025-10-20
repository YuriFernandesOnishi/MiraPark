import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
    title?: string;
    onPress: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    children?: React.ReactNode;
    iconOnly?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function CustomButton({
                                         title,
                                         onPress,
                                         disabled = false,
                                         variant = 'primary',
                                         size = 'medium',
                                         children,
                                         iconOnly = false,
                                         style,
                                         textStyle,
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

    const getSizeStyle = (): ViewStyle => {
        if (iconOnly) {
            switch (size) {
                case 'small':
                    return { width: 48, height: 48, borderRadius: 24 };
                case 'large':
                    return { width: 64, height: 64, borderRadius: 32 };
                case 'medium':
                default:
                    return { width: 56, height: 56, borderRadius: 28 };
            }
        }

        switch (size) {
            case 'small':
                return { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14 };
            case 'large':
                return { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 16 };
            case 'medium':
            default:
                return { paddingVertical: 14, paddingHorizontal: 18, borderRadius: 14 };
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                getBorder(),
                getSizeStyle(),
                disabled && styles.buttonDisabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.85}
        >
            {children ? (
                children
            ) : (
                <Text
                    style={[
                        styles.buttonText,
                        { color: getTextColor() },
                        iconOnly ? styles.iconText : null,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
    },
    iconText: {
        fontSize: 26,
        lineHeight: 28,
        fontWeight: '800',
    },
});
