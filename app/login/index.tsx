import {View, Text, StyleSheet, TextInput} from "react-native";


export default function LoginScreen() {
    return (
        <View style={syles.container}>
          <Text>Login Screen</Text>
            <TextInput
                style={syles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                //value={email}
                //onChangeText={setEmail}
            />
        </View>
    );
}


const syles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: '80%',
    },
})