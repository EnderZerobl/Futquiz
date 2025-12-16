import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { getTeams } from "../../../mock/teams.mock";
import { addQuestion } from "../../../mock/question.mock";

export default function CadastrarPerguntaScreen() {
  const navigation = useNavigation();
  const teams = getTeams();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (teamId: string) => {
    setSelectedTags((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!question || options.some((opt) => !opt) || selectedTags.length === 0) {
      console.log("Preencha todos os campos");
      return;
    }
  
    addQuestion({
      question,
      options,
      tags: selectedTags,
    });
  
    navigation.goBack();
  };  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CADASTRAR PERGUNTA/RESPOSTA</Text>
      </View>

      <Text style={styles.label}>Pergunta</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
      />

      <View style={styles.optionsContainer}>
        {options.map((opt, index) => (
          <View key={index} style={styles.optionBox}>
            <Text style={styles.optionTitle}>OPÇÃO {index + 1}</Text>
            <TextInput
              style={styles.optionInput}
              value={opt}
              onChangeText={(v) => handleOptionChange(index, v)}
            />
          </View>
        ))}
      </View>

      <Text style={styles.label}>Tags:</Text>
      <View style={styles.tagsContainer}>
        {teams.map((team) => (
          <TouchableOpacity
            key={team.id}
            style={[
              styles.tag,
              selectedTags.includes(team.id) && styles.tagSelected,
            ]}
            onPress={() => toggleTag(team.id)}
          >
            {team.badge && (
              <Image source={{ uri: team.badge }} style={styles.tagImage} />
            )}
            <Text style={styles.tagText}>{team.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Finalizar Cadastro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}