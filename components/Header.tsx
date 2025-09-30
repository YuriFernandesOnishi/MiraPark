import { router } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function Header() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => goTo("/")}>
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => goTo("/about")}>
                <Text style={styles.buttonText}>Sobre</Text>
            </TouchableOpacity>
        </View>
    );
}

function goTo(route: string) {
    router.push(route); // router.navigate não existe, o correto é push
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",       // Coloca os botões na horizontal
        justifyContent: "space-around", // Espaço entre os botões
        alignItems: "center",
        paddingVertical: 15,
        backgroundColor: "#4a90e2",  // Cor de fundo do header
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: "#fff",     // Botão branco
    },
    buttonText: {
        color: "#4a90e2",            // Texto azul combinando com o header
        fontWeight: "bold",
        fontSize: 16,
    },
});
