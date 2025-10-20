import React from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import CustomButton from "./CustomButton";

interface EntryModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    plateValue: string;
    onChangePlate: (text: string) => void;
    title?: string;
}

export default function ModalVehicles({
                                       visible,
                                       onClose,
                                       onConfirm,
                                       plateValue,
                                       onChangePlate,
                                       title = "Modal de Veículos",
                                   }: EntryModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <View style={styles.content}>
                        <Text style={styles.title}>{title}</Text>

                        <TextInput
                            placeholder="Digite a placa"
                            placeholderTextColor="#888"
                            value={plateValue}
                            onChangeText={onChangePlate}
                            style={styles.input}
                            autoCapitalize="characters"
                            maxLength={8}
                        />

                        <View style={styles.buttons}>
                            <CustomButton
                                title="Cancelar"
                                onPress={onClose}
                                variant="outline"
                                size="small"
                            />
                            <CustomButton
                                title="Confirmar"
                                onPress={onConfirm}
                                variant="primary"
                                size="small"
                            />
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
        padding: 20,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#6C63FF",
        textAlign: "center",
        marginBottom: 16,
    },
    input: {
        backgroundColor: "#1E1E2F",
        color: "#fff",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#333",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
});
