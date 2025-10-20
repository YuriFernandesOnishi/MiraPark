import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Image,
    Alert,
    ActivityIndicator,
    Platform,
} from "react-native";
import CustomButton from "./CustomButton";
import ModalVehicles from "./ModalVehicles";
import SearchModal from "./SearchModal";
import api from "../../services/api";

interface BottomNavbarProps {
    token?: string | null;
    onRefresh?: () => Promise<void> | void;
}

export default function BottomNavbar({ token, onRefresh }: BottomNavbarProps) {
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [entryModalVisible, setEntryModalVisible] = useState(false);
    const [exitModalVisible, setExitModalVisible] = useState(false);
    const [plateInput, setPlateInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEntry = async () => {
        if (!plateInput.trim()) {
            return Alert.alert("Erro", "Informe a placa do veículo.");
        }
        if (!token) return Alert.alert("Erro", "Usuário não autenticado.");

        try {
            setLoading(true);
            const res = await api.post(
                "/api/veiculos/entrada",
                { placa: plateInput.toUpperCase() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert("Sucesso", res.data?.mensagem ?? "Entrada registrada.");
            setEntryModalVisible(false);
            setPlateInput("");
            if (onRefresh) await onRefresh();
        } catch (err) {
            console.error("Erro entrada:", err);
            Alert.alert("Erro", "Não foi possível registrar a entrada.");
        } finally {
            setLoading(false);
        }
    };

    const handleExit = async () => {
        if (!plateInput.trim()) {
            return Alert.alert("Erro", "Informe a placa do veículo.");
        }
        if (!token) return Alert.alert("Erro", "Usuário não autenticado.");

        try {
            setLoading(true);
            const res = await api.put(
                "/api/veiculos/saida",
                { placa: plateInput.toUpperCase() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert("Sucesso", res.data?.mensagem ?? "Saída registrada.");
            setExitModalVisible(false);
            setPlateInput("");
            if (onRefresh) await onRefresh();
        } catch (err) {
            console.error("Erro saida:", err);
            Alert.alert("Erro", "Não foi possível registrar a saída.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                </View>
            )}

            <View style={styles.container}>
                <CustomButton
                    onPress={() => setSearchModalVisible(true)}
                    variant="secondary"
                    size="medium"
                    iconOnly
                >
                    <Image
                        source={require("../../assets/search-icon.png")}
                        style={styles.icon}
                    />
                </CustomButton>

                <CustomButton
                    title="+"
                    onPress={() => setEntryModalVisible(true)}
                    variant="primary"
                    size="medium"
                    iconOnly
                />

                <CustomButton
                    title="-"
                    onPress={() => setExitModalVisible(true)}
                    variant="primary"
                    size="medium"
                    iconOnly
                />
            </View>

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

            <SearchModal
                visible={searchModalVisible}
                onClose={() => setSearchModalVisible(false)}
                token={token}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#2A2A40",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 12,
        marginHorizontal: 5,
        marginBottom: 30,
    },
    icon: {
        width: 28,
        height: 28,
        resizeMode: "contain",
    },
    loadingContainer: {
        position: "absolute",
        bottom: 66,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 50,
    },
});
