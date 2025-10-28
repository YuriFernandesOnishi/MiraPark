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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { vehicleService } from "../services/vehicleService";
import BottomNavbar, { BOTTOM_NAVBAR_HEIGHT } from "../components/ui/BottomNavbar";

type Vehicle = {
    placa: string;
    dataEntrada: string;
    horarioEntrada: string;
};

export default function VehicleList() {
    const { token, loading: authLoading } = useAuth();
    const insets = useSafeAreaInsets();

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
                    contentContainerStyle={{
                        paddingBottom: BOTTOM_NAVBAR_HEIGHT + insets.bottom + 12,
                        flexGrow: 1,
                    }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>Nenhum veículo ativo no momento</Text>
                    )}
                />
            )}

            <BottomNavbar onRefresh={fetchVehicles} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2f1e1e",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#c54b4b",
        textAlign: "center",
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#402a2a",
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
        color: "#ffa0a0",
        marginTop: 4,
    },
    emptyText: {
        color: "#ffa0a0",
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
    },
});
