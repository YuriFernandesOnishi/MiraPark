import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import ModalVehicles from "../components/ui/ModalVehicles";
import CustomButton from "../components/ui/CustomButton";
import SearchModal from "../components/ui/SearchModal";
import { vehicleService } from "../services/vehicleService";

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
        // cria uma função async no efeito e aguarda — evita "Promise is ignored"
        let isActive = true;

        const load = async () => {
            if (!token) {
                // limpa lista caso deslogue
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
            <View style={styles.header}>
                <Text style={styles.title}>Veículos Ativos</Text>

                <View style={styles.headerButtons}>
                    <CustomButton onPress={() => setSearchModalVisible(true)} variant="secondary" size="small" iconOnly>
                        <Image source={require("../assets/search-icon.png")} style={styles.image} />
                    </CustomButton>

                    <CustomButton title="+" onPress={() => setEntryModalVisible(true)} variant="primary" size="small" iconOnly />

                    <CustomButton title="-" onPress={() => setExitModalVisible(true)} variant="primary" size="small" iconOnly />
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item.placa + item.horarioEntrada}
                    renderItem={renderVehicle}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhum veículo ativo no momento</Text>}
                />
            )}

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
    header: {
        marginBottom: 20,
        alignItems: "center",
        gap: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerButtons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#6C63FF",
        textAlign: "center",
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
    image: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
});
