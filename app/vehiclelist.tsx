import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import ModalVehicles from "../components/ui/ModalVehicles";
import SearchModal from "../components/ui/SearchModal";
import { vehicleService } from "../services/vehicleService";
import BottomNavbar from "../components/ui/BottomNavbar";

type Vehicle = {
    placa: string;
    dataEntrada: string;
    horarioEntrada: string;
};

export default function VehicleList() {
    const { token, loading: authLoading } = useAuth();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [entryModalVisible, setEntryModalVisible] = useState(false);
    const [exitModalVisible, setExitModalVisible] = useState(false);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [plateInput, setPlateInput] = useState("");

    const fetchVehicles = async (): Promise<void> => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await vehicleService.getActiveVehicles();
            setVehicles(data);
        } catch (error) {
            console.error("Erro ao buscar veículos:", error);
            Alert.alert("Erro", "Não foi possível recuperar a lista de veículos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isActive = true;

        const load = async () => {
            if (!token) {
                if (isActive) setVehicles([]);
                return;
            }

            try {
                if (isActive) setLoading(true);
                const data = await vehicleService.getActiveVehicles();
                if (isActive) setVehicles(data);
            } catch (error) {
                console.error("Erro ao buscar veículos (useEffect):", error);
                if (isActive) Alert.alert("Erro", "Não foi possível carregar veículos.");
            } finally {
                if (isActive) setLoading(false);
            }
        };

        void load();

        return () => {
            isActive = false;
        };
    }, [token]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchVehicles();
        setRefreshing(false);
    };

    const handleEntry = async () => {
        if (!plateInput.trim()) {
            return Alert.alert("Erro", "Informe a placa do veículo.");
        }
        try {
            setLoading(true);
            const response = await vehicleService.entry(plateInput.toUpperCase());
            Alert.alert("Sucesso", response?.mensagem || "Entrada registrada.");
            setEntryModalVisible(false);
            setPlateInput("");
            await fetchVehicles();
        } catch (error: any) {
            console.error("Erro ao registrar entrada:", error);
            const msg = error?.response?.data?.mensagem || "Não foi possível liberar a entrada.";
            Alert.alert("Erro", msg);
        } finally {
            setLoading(false);
        }
    };

    const handleExit = async () => {
        if (!plateInput.trim()) {
            return Alert.alert("Erro", "Informe a placa do veículo.");
        }
        try {
            setLoading(true);
            const response = await vehicleService.exit(plateInput.toUpperCase());
            Alert.alert("Sucesso", response?.mensagem || "Saída registrada.");
            setExitModalVisible(false);
            setPlateInput("");
            await fetchVehicles();
        } catch (error: any) {
            console.error("Erro ao registrar saída:", error);
            const msg = error?.response?.data?.mensagem || "Não foi possível liberar a saída.";
            Alert.alert("Erro", msg);
        } finally {
            setLoading(false);
        }
    };

    const renderVehicle = ({ item }: { item: Vehicle }) => (
        <View style={styles.card}>
            <Text style={styles.plate}>{item.placa}</Text>
            <Text style={styles.entry}>
                Entrada: {item.dataEntrada} {item.horarioEntrada}
            </Text>
        </View>
    );

    if (authLoading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Veículos Ativos</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item.placa + item.horarioEntrada}
                    renderItem={renderVehicle}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>Nenhum veículo ativo no momento</Text>
                    )}
                />
            )}

            <BottomNavbar
                onSearchPress={() => setSearchModalVisible(true)}
                onEntryPress={() => setEntryModalVisible(true)}
                onExitPress={() => setExitModalVisible(true)}
            />

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: "#1E1E2F",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#6C63FF",
        textAlign: "center",
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#2A2A40",
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
    },
    plate: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
    },
    entry: {
        fontSize: 16,
        color: "#A0A0FF",
        marginTop: 4,
    },
    emptyText: {
        color: "#A0A0FF",
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
    },
});
