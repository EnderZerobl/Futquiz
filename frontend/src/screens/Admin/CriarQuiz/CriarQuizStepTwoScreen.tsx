import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getQuestions } from "../../../mock/questions.mock";
import { addQuiz } from "../../../mock/quiz.mock";
import styles from "./styles";

export default function CriarQuizStepTwoScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { hasReward, title, tag, timePerQuestion } = route.params;

  const questions = getQuestions().filter((q) => q.tags.includes(tag));
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [price, setPrice] = useState("");

  const toggleQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id)
        ? prev.filter((q) => q !== id)
        : [...prev, id]
    );
  };

  const handleCreateQuiz = () => {
    addQuiz({
      title,
      hasReward,
      price: hasReward ? price : undefined,
      timePerQuestion,
      tag,
      questions: selectedQuestions,
    });

    navigation.navigate("HomeScreen" as never);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {hasReward && (
        <TextInput
          style={styles.input}
          placeholder="Digite o valor mínimo"
          placeholderTextColor="#E8FFF3"
          value={price}
          onChangeText={setPrice}
        />
      )}

      <Text style={styles.label}>Selecionar perguntas</Text>

      {questions.map((q) => (
        <TouchableOpacity
          key={q.id}
          style={[
            styles.questionCard,
            selectedQuestions.includes(q.id) && styles.questionSelected,
          ]}
          onPress={() => toggleQuestion(q.id)}
        >
          <Text style={styles.questionText}>{q.question}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleCreateQuiz}>
        <Text style={styles.submitText}>Criar Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}