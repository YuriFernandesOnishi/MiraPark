import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
} from "react-native";
import api from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import BottomNavbar from "../components/ui/BottomNavbar";

type Vehicle = {
    placa: string;
    dataEntrada: string;
    horarioEntrada: string;
};

export default function Vehiclelist() {
    const { token, loading: authLoading } = useAuth();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchVehicles = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await api.get<Vehicle[]>("/api/veiculos", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVehicles(response.data);
        } catch (error) {
            console.error("Erro ao buscar veículos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchVehicles().then(_r => {});
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
            <View
                style={[
                    styles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    const screenHeight = Dimensions.get("window").height;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Veículos Ativos</Text>
            </View>

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color="#6C63FF"
                    style={{ marginTop: 40 }}
                />
            ) : (
                <FlatList
                    data={vehicles}
                    keyExtractor={(item, index) => `${item.placa}-${item.horarioEntrada}-${index}`}                    renderItem={renderVehicle}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>
                            Nenhum veículo ativo no momento
                        </Text>
                    )}
                    contentContainerStyle={{
                        paddingBottom: screenHeight * 0.12,
                        paddingTop: 8,
                    }}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <BottomNavbar token={token} onRefresh={fetchVehicles} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E2F",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        marginBottom: 16,
        alignItems: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#6C63FF",
    },
    card: {
        backgroundColor: "#2A2A40",
        padding: 16,
        borderRadius: 12,
        marginVertical: 6,
        elevation: 2,
    },
    plate: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
    },
    entry: {
        fontSize: 15,
        color: "#A0A0FF",
        marginTop: 4,
    },
    emptyText: {
        color: "#A0A0FF",
        textAlign: "center",
        marginTop: 60,
        fontSize: 16,
    },
});
