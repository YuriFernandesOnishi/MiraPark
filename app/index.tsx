import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Header from "../components/Header";



export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container} >
            <Header />
            <View style={styles.content}>
                <Text style={styles.text}>Bem-vindo ao app com Expo Router!</Text>
                <Button title="Ir para Sobre" onPress={() => router.push("/about")} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0b91f6",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
        color: "#333",
    },
});
