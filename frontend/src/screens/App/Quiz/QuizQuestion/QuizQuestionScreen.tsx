import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

const mockQuestion = {
  question: "Qual a data de fundação do Esporte Clube Vitória?",
  options: [
    "20 de janeiro de 1899",
    "13 de maio de 1899",
    "05 de agosto de 1899",
    "18 de setembro de 1899",
  ],
  correctIndex: 0,
};

export default function QuizQuestionScreen() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExit, setShowExit] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>PERGUNTA 01 de 12</Text>
      <Text style={styles.question}>{mockQuestion.question}</Text>

      {mockQuestion.options.map((opt, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selected === index && styles.optionSelected,
          ]}
          onPress={() => setSelected(index)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.exitButton}
        onPress={() => setShowExit(true)}
      >
        <Text>Sair do Quiz</Text>
      </TouchableOpacity>

      {showExit && (
        <View style={styles.modal}>
          <Text>Tem certeza que deseja sair do quiz?</Text>

          <TouchableOpacity style={styles.confirm}>
            <Text>Sair do Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowExit(false)}>
            <Text>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}