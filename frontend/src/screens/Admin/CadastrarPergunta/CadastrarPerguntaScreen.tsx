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
import { addQuestion } from "../../../mock/questions.mock";
import { QuestionOption } from "../../../types/Question";

export default function CadastrarPerguntaScreen() {
  const navigation = useNavigation();
  const teams = getTeams();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
    { id: "3", text: "" },
    { id: "4", text: "" },
  ]);  
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (teamId: string) => {
    setSelectedTags((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) =>
      prev.map((opt, i) =>
        i === index ? { ...opt, text: value } : opt
      )
    );
  };

  const handleSubmit = () => {
    if (
      !question ||
      options.some((opt) => !opt.text) ||
      !correctOptionId ||
      selectedTags.length === 0
    ) {
      console.log("Preencha todos os campos");
      return;
    }
  
    addQuestion({
      question,
      options,
      correctOptionId,
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
        <Text style={styles.headerTitle}>CADASTRAR PERGUNTA / RESPOSTA</Text>
      </View>
  
      <Text style={styles.label}>Pergunta</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="Digite a pergunta"
        placeholderTextColor="#aaa"
      />
  
      <Text style={styles.label}>Alternativas</Text>
  
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionBox,
              correctOptionId === option.id && styles.correctOption,
            ]}
            activeOpacity={0.9}
            onPress={() => setCorrectOptionId(option.id)}
          >
            <Text style={styles.optionLabel}>OPÇÃO {index + 1}</Text>
  
            <TextInput
              style={styles.optionInput}
              value={option.text}
              onChangeText={(text) =>
                setOptions((prev) =>
                  prev.map((opt) =>
                    opt.id === option.id ? { ...opt, text } : opt
                  )
                )
              }
              placeholder={`Digite a opção ${index + 1}`}
              placeholderTextColor="#aaa"
            />
  
            {correctOptionId === option.id && (
              <Text style={styles.correctText}>✓ Resposta correta</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
  
      <Text style={styles.label}>Tags</Text>
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