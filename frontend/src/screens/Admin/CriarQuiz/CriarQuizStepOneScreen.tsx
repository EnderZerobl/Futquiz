import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getTeams } from "../../../mock/teams.mock";
import styles from "./styles";

export default function CriarQuizStepOneScreen() {
  const navigation = useNavigation();
  const teams = getTeams();

  const [hasReward, setHasReward] = useState(false);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [timePerQuestion, setTimePerQuestion] = useState("");

  const handleNext = () => {
    navigation.navigate("CriarQuizStepTwo" as never, {
      hasReward,
      title,
      tag,
      timePerQuestion,
    } as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRIAR QUIZ</Text>

      <TouchableOpacity onPress={() => setHasReward(false)}>
        <Text style={styles.radio}>{!hasReward ? "◉" : "○"} SEM RECOMPENSA</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setHasReward(true)}>
        <Text style={styles.radio}>{hasReward ? "◉" : "○"} COM RECOMPENSA</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome do quiz"
        placeholderTextColor="#E8FFF3"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Tema do Quiz</Text>
      {teams.map((team) => (
        <TouchableOpacity
          key={team.id}
          style={[
            styles.tag,
            tag === team.id && styles.tagSelected,
          ]}
          onPress={() => setTag(team.id)}
        >
          <Text style={styles.tagText}>{team.name}</Text>
        </TouchableOpacity>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Tempo por questão (ex: 30 seg)"
        placeholderTextColor="#E8FFF3"
        value={timePerQuestion}
        onChangeText={setTimePerQuestion}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
        <Text style={styles.submitText}>Avançar</Text>
      </TouchableOpacity>
    </View>
  );
}