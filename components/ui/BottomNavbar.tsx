import React, { useEffect, useRef, useState } from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Animated,
    Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { vehicleService } from "../../services/vehicleService";
import ModalVehicles from "../../components/ui/ModalVehicles";
import SearchModal from "../../components/ui/SearchModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const BOTTOM_NAVBAR_HEIGHT = 92;

interface BottomNavbarProps {
    onRefresh?: () => void;
    showSearch?: boolean;
    showEntry?: boolean;
    showExit?: boolean;
    onSearchPress?: () => void;
    onEntryPress?: () => void;
    onExitPress?: () => void;
    height?: number;
}
const normalizePlate = (q: string) => q.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

const isPlateValid = (q: string) => {
    const p = normalizePlate(q);
    return /^[A-Z]{3}[0-9]{4}$/.test(p) || /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(p);
};


function AnimatedButton({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, { toValue: 0.92, useNativeDriver: true }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    };



    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                style={styles.button}
            >
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function BottomNavbar({
                                         onRefresh,
                                         showSearch = true,
                                         showEntry = true,
                                         showExit = true,
                                         onSearchPress,
                                         onEntryPress,
                                         onExitPress,
                                         height,
                                     }: BottomNavbarProps) {
    const { token } = useAuth();
    const insets = useSafeAreaInsets();

    const navHeight = height ?? BOTTOM_NAVBAR_HEIGHT;

    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [entryModalVisible, setEntryModalVisible] = useState(false);
    const [exitModalVisible, setExitModalVisible] = useState(false);
    const [plateInput, setPlateInput] = useState("");
    const [loading, setLoading] = useState(false);

    const navTranslateY = useRef(new Animated.Value(navHeight + 40)).current; // start off-screen
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(navTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start();
    }, [navTranslateY]);

    useEffect(() => {
        const anyModal = searchModalVisible || entryModalVisible || exitModalVisible;

        Animated.parallel([
            Animated.timing(navTranslateY, {
                toValue: anyModal ? -60 : 0,
                duration: 260,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: anyModal ? 0.28 : 0,
                duration: 260,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, [searchModalVisible, entryModalVisible, exitModalVisible, navTranslateY, overlayOpacity]);

    const handleEntry = async () => {
        if (!plateInput.trim()) return Alert.alert("Erro", "Informe a placa do veículo.");
        if (!token) return Alert.alert("Erro", "Usuário não autenticado.");

        const cleaned = normalizePlate(plateInput);
        if (!isPlateValid(plateInput)) {
            return Alert.alert("Erro", "Placa inválida. Use AAA-1234 ou AAA1A23.");
        }

        try {
            setLoading(true);
            const response = await vehicleService.entry(cleaned);
            Alert.alert("Sucesso", response?.mensagem || "Entrada registrada.");
            setEntryModalVisible(false);
            setPlateInput("");
            onRefresh?.();
        } catch (error: any) {
            console.error("Erro ao registrar entrada (BottomNavbar):", error);
            const msg = error?.response?.data?.mensagem || "Não foi possível liberar a entrada.";
            Alert.alert("Erro", msg);
        } finally {
            setLoading(false);
        }
    };


    const handleExit = async () => {
        if (!plateInput.trim()) return Alert.alert("Erro", "Informe a placa do veículo.");
        if (!token) return Alert.alert("Erro", "Usuário não autenticado.");

        try {
            setLoading(true);
            const response = await vehicleService.exit(plateInput.toUpperCase());
            Alert.alert("Sucesso", response?.mensagem || "Saída registrada.");
            setExitModalVisible(false);
            setPlateInput("");
            onRefresh?.();
        } catch (error: any) {
            console.error("Erro ao registrar saída (BottomNavbar):", error);
            const msg = error?.response?.data?.mensagem || "Não foi possível liberar a saída.";
            Alert.alert("Erro", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.wrapper, { bottom: 0 }]}
              pointerEvents={loading ? "none" : "auto"}
        >
            {/* overlay */}
            <Animated.View
                pointerEvents={searchModalVisible || entryModalVisible || exitModalVisible ? "auto" : "none"}
                style={[styles.overlay, { opacity: overlayOpacity }]}
            />

            <Animated.View
                style={[styles.container, { transform: [{ translateY: navTranslateY }] }]}
            >
                <View style={[styles.navbar, { height: navHeight, paddingBottom: insets.bottom + 8 }]}>
                    {showSearch && (
                        <AnimatedButton onPress={() => (onSearchPress ? onSearchPress() : setSearchModalVisible(true))}>
                            <Ionicons name="search" size={24} color="#FFFFFF" />
                        </AnimatedButton>
                    )}

                    {showEntry && (
                        <AnimatedButton onPress={() => (onEntryPress ? onEntryPress() : setEntryModalVisible(true))}>
                            <Ionicons name="add" size={26} color="#FFFFFF" />
                        </AnimatedButton>
                    )}

                    {showExit && (
                        <AnimatedButton onPress={() => (onExitPress ? onExitPress() : setExitModalVisible(true))}>
                            <Ionicons name="remove" size={26} color="#FFFFFF" />
                        </AnimatedButton>
                    )}
                </View>

                {loading && (
                    <View style={styles.loadingOverlay} pointerEvents="none">
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    </View>
                )}
            </Animated.View>

            <ModalVehicles
                visible={entryModalVisible}
                onClose={() => setEntryModalVisible(false)}
                onConfirm={handleEntry}
                plateValue={plateInput}
                onChangePlate={setPlateInput}
                title={"Registrar Entrada do Veículo"}
            />

            <ModalVehicles
                visible={exitModalVisible}
                onClose={() => setExitModalVisible(false)}
                onConfirm={handleExit}
                plateValue={plateInput}
                onChangePlate={setPlateInput}
                title={"Registrar Saída do Veículo"}
            />

            <SearchModal visible={searchModalVisible} onClose={() => setSearchModalVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 50,
    },
    overlay: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "#000",
        zIndex: 40,
    },
    container: {
        alignItems: "center",
        width: "100%",
    },
    navbar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#313148",
        paddingHorizontal: 20,
        paddingVertical: 5,
        width: "100%",
    },
    button: {
        backgroundColor: "#6C63FF",
        width: 62,
        height: 62,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#6C63FF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 6,
    },
    loadingOverlay: {
        position: "absolute",
        bottom: 62,
        right: 28,
        padding: 8,
        borderRadius: 8,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
});
