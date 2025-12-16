import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getTeams } from "../../../mock/teams.mock";
import styles from "./styles";

export default function CriarQuizStepOneScreen() {
  const navigation = useNavigation();
  const teams = getTeams();

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const [hasReward, setHasReward] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timePerQuestion, setTimePerQuestion] = useState("");

  const handleNext = () => {
    navigation.navigate("CriarQuizStepTwo" as never, {
      title,
      description,
      timePerQuestion,
      hasReward,
      teamId: selectedTeamId,
    } as never);
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>CRIAR QUIZ</Text>

        <TouchableOpacity>
            <Text style={styles.radio}>{!hasReward ? "◉" : "○"} SEM RECOMPENSA</Text>
        </TouchableOpacity>

        <View style={styles.disabledOption}>
            <Text style={styles.radioDisabled}>○ COM RECOMPENSA <Text style={styles.comingSoon}>(em breve)</Text></Text>
        </View>

        <TextInput
            style={styles.input}
            placeholder="Digite o nome do quiz"
            placeholderTextColor="#E8FFF3"
            value={title}
            onChangeText={setTitle}
        />

        <TextInput
            style={styles.input}
            placeholder="Descreva o quiz"
            placeholderTextColor="#E8FFF3"
            value={description}
            onChangeText={setDescription}
        />

        <Text style={styles.label}>Tema do Quiz</Text>
        {teams.map((team) => (
            <TouchableOpacity
            key={team.id}
            style={[
                styles.teamItem,
                selectedTeamId === team.id && styles.teamSelected,
            ]}
            onPress={() => setSelectedTeamId(team.id)}
            >
            <Text style={styles.teamName}>{team.name}</Text>
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