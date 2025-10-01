// app/vehiclelist.tsx
import React, { useEffect, useState } from "react";
import {View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, StatusBar} from "react-native";
import { useRouter } from "expo-router";
import api from "../services/api";
import Button from "../components/ui/Button";
import {SafeAreaView} from "react-native-safe-area-context";

type Vehicle = {
    placa: string;
    dataEntrada: string;
    horarioEntrada: string;
};

export default function Vehiclelist() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await api.get<Vehicle[]>("/api/veiculos");
            setVehicles(response.data);
        } catch (error) {
            console.error("Erro ao buscar veículos:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchVehicles();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const renderVehicle = ({ item }: { item: Vehicle }) => (
        <View style={styles.card}>
            <Text style={styles.plate}>{item.placa}</Text>
            <Text style={styles.entry}>Entrada: {item.dataEntrada} {item.horarioEntrada}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button title="Voltar" onPress={() => router.replace("/")} variant="outline" size="small" />
                <Text style={styles.title}>Vagas Ativas</Text>
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
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>Nenhum veículo ativo no momento</Text>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E2F",
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#6C63FF",
        marginBottom: 10,
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
});
