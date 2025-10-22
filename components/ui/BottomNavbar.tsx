import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomNavbarProps {
    onSearchPress?: () => void;
    onEntryPress?: () => void;
    onExitPress?: () => void;
}

export default function BottomNavbar({
                                         onSearchPress,
                                         onEntryPress,
                                         onExitPress,
                                     }: BottomNavbarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <TouchableOpacity style={styles.button} onPress={onSearchPress}>
                    <Ionicons name="search" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={onEntryPress}>
                    <Ionicons name="add" size={26} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={onExitPress}>
                    <Ionicons name="remove" size={26} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    navbar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "rgba(59,59,117,0.57)",
        paddingHorizontal: 20,
        paddingVertical: 20,
        width: "100%",
    },
    button: {
        backgroundColor: "#6C63FF",
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#6C63FF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 6,
    },
});
