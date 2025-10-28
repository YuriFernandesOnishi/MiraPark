import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AuthInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  icon: keyof typeof MaterialIcons.glyphMap;
}

export default function AuthInput({
                                    placeholder,
                                    value,
                                    onChangeText,
                                    secureTextEntry = false,
                                    keyboardType = 'default',
                                    autoCapitalize = 'none',
                                    icon
                                  }: AuthInputProps) {
  return (
      <View style={styles.inputContainer}>
        <MaterialIcons name={icon} size={24} color="#6C63FF" style={styles.icon} />
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            style={styles.input}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#2f1e1e",
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#c54b4b",
      paddingHorizontal: 12
  },
  icon: {
      marginRight: 8,
      color: "#d95454"
      },
  input: {
      flex: 1,
      color: "#fff",
      paddingVertical: 14,
      fontSize: 16
  },
});