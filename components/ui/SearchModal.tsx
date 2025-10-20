import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    FlatList,
    Alert,
} from "react-native";
import CustomButton from "./CustomButton";
import api from "../../services/api";

type VehicleRecord = {
    placa: string;
    dataEntrada: string;
    horarioEntrada: string;
    dataSaida?: string | null;
    horarioSaida?: string | null;
    valorPago?: number | null;
};

interface SearchModalProps {
    visible: boolean;
    onClose: () => void;
    token?: string | null;
}

export default function SearchModal({ visible, onClose, token }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [singleResult, setSingleResult] = useState<VehicleRecord | null>(null);
    const [listResult, setListResult] = useState<VehicleRecord[] | null>(null);

    const clearResults = () => {
        setSingleResult(null);
        setListResult(null);
    };

    const validateAndSearch = async () => {
        const q = query.trim();

        if (!q) {
            return Alert.alert("Atenção", "Digite um id ou placa para buscar.");
        }

        const isId = /^\d+$/.test(q);

        const isPlate = /^[A-Za-z0-9]{7}$/.test(q);

        if (!isId && !isPlate) {
            return Alert.alert("Formato inválido", "Digite apenas números para ID ou 7 caracteres alfanuméricos para placa.");
        }

        if (!token) {
            return Alert.alert("Erro", "Token ausente. Faça login novamente.");
        }

        try {
            setLoading(true);
            clearResults();

            if (isId) {
                const id = q;
                const res = await api.get<VehicleRecord>(`/api/veiculos/id/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSingleResult(res.data);
            } else if (isPlate) {
                const plate = q.toUpperCase();
                const res = await api.get<VehicleRecord[]>(`/api/veiculos/placa/${plate}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setListResult(res.data);
            }
        } catch (err: any) {
            console.error("Erro na busca:", err);
            const message = err?.response?.data?.mensagem || "Erro ao buscar veículo.";
            Alert.alert("Erro", message);
        } finally {
            setLoading(false);
        }
    };

    const renderRecord = ({ item }: { item: VehicleRecord }) => (
        <View style={styles.recordCard}>
            <Text style={styles.recordPlate}>{item.placa}</Text>
            <Text style={styles.recordText}>
                Entrada: {item.dataEntrada} {item.horarioEntrada}
            </Text>
            <Text style={styles.recordText}>
                Saída: {item.dataSaida ?? "-"} {item.horarioSaida ?? ""}
            </Text>
            <Text style={styles.recordText}>Pago: {item.valorPago ?? "-"}</Text>
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Buscar Veículo (ID ou Placa)</Text>

                        <TextInput
                            placeholder="Digite ID (números) ou placa (7 chars)"
                            placeholderTextColor="#999"
                            value={query}
                            onChangeText={setQuery}
                            style={styles.input}
                            autoCapitalize="characters"
                            keyboardType="default"
                            returnKeyType="search"
                            onSubmitEditing={validateAndSearch}
                            maxLength={10}
                        />

                        <View style={styles.buttonsRow}>
                            <CustomButton title="Buscar" onPress={validateAndSearch} variant="primary" size="small" />
                            <CustomButton title="Fechar" onPress={() => { clearResults(); setQuery(""); onClose(); }} variant="outline" size="small" />
                        </View>

                        <View style={{ marginTop: 12 }}>
                            {loading && <ActivityIndicator size="small" color="#6C63FF" />}

                            {!loading && singleResult && (
                                <View style={{ marginTop: 12 }}>
                                    <Text style={styles.sectionTitle}>Resultado (ID)</Text>
                                    {renderRecord({ item: singleResult })}
                                </View>
                            )}

                            {!loading && listResult && (
                                <View style={{ marginTop: 12 }}>
                                    <Text style={styles.sectionTitle}>Registros da placa ({listResult.length})</Text>
                                    <FlatList
                                        data={listResult}
                                        keyExtractor={(it, idx) => `${it.placa}-${it.dataEntrada}-${idx}`}
                                        renderItem={renderRecord}
                                        contentContainerStyle={{ paddingBottom: 8 }}
                                    />
                                </View>
                            )}

                            {!loading && !singleResult && !listResult && (
                                <Text style={styles.hintText}>Resultados aparecerão aqui após a busca.</Text>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    content: {
        width: "100%",
        backgroundColor: "#2A2A40",
        borderRadius: 12,
        padding: 18,
        maxHeight: "85%",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#6C63FF",
        textAlign: "center",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#1E1E2F",
        color: "#fff",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#333",
    },
    buttonsRow: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },
    sectionTitle: {
        color: "#A0A0FF",
        fontWeight: "700",
        marginBottom: 8,
    },
    recordCard: {
        backgroundColor: "#232333",
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
    },
    recordPlate: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 18,
        marginBottom: 4,
    },
    recordText: {
        color: "#BFC3FF",
        fontSize: 14,
    },
    hintText: {
        color: "#999",
        marginTop: 8,
        textAlign: "center",
    },
});
