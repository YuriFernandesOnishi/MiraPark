import {StyleSheet, Text, View} from "react-native";


export default function Card({ title }: { title: string }) {
    return (
        <View style={styles.container}>
            <Text>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
        width: "90%",
        alignSelf: "center",
        marginTop: 16,
    }
})