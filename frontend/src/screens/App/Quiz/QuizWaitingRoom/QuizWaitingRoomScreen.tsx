import React from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./styles";

const mockPlayers = [
  "Laura Santos",
  "Maria Vitória",
  "Nicole Almeida",
  "Fabiana Pereira",
];

export default function QuizWaitingRoomScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>QUIZ GERAL TIMES</Text>
      <Text style={styles.subtitle}>SALA DE ESPERA</Text>

      {/* <Text style={styles.timer}>Inicia em 00:18</Text> */}

      <FlatList
        data={mockPlayers}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Text style={styles.player}>{item}</Text>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("QuizCountdown" as never)}
      >
        <Text style={styles.buttonText}>Iniciar Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}