import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import Card from "../components/Card";
import ParkingSlot from "../components/ParkingSlot";

export default function AboutScreen() {
  const router = useRouter();

  return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Essa é a tela Sobre.</Text>
        <Card title="Teste" />
        <ParkingSlot/>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
  );
}
