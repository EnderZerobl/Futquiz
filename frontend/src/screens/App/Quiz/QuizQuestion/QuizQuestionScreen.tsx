import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import styles from "./styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../../../navigation";

type NavigationProps = StackNavigationProp<AppStackParamList, "QuizQuestion">;
type RouteProps = RouteProp<AppStackParamList, "QuizQuestion">;

export default function QuizQuestionScreen() {  
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();

  const { quiz, questions } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const [showExit, setShowExit] = useState(false);

  const [questionTime, setQuestionTime] = useState<number>(quiz.timePerQuestion);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [score, setScore] = useState(0);
  
  const question = questions[currentIndex];

  useEffect(() => {
    if (questionTime === 0) {
      handleNextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setQuestionTime((prev) => prev - 1);
      setTotalTime((prev) => prev + 1);
    }, 1000)

    return () => clearInterval(timer);
  }, [questionTime]);

  const handleSelect = (optionId: string) => {
    if (revealed) return;

    setSelectedOption(optionId);
    setRevealed(true);

    if (optionId === question.correctOptionId) {
      setScore((prev) => prev + 50);
    } else {
      setScore((prev) => prev - 10);
    }
  };

  const getOptionStyle = (optionId: string) => {
    if(!revealed) return styles.option;

    if (optionId === question.correctOptionId) {
      return styles.optionCorrect;
    }

    if (optionId === selectedOption) {
      return styles.optionWrong;
    }

    return styles.option;
  }

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= quiz.questionsIds.length) {
      navigation.replace("QuizResult", {
        quizId: quiz.id,
        score,
        totalTime,
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setRevealed(false);
      setQuestionTime(quiz.timePerQuestion);
    }
  };

  const handleExit = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeScreen" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>PERGUNTA {currentIndex + 1} de {questions.length}</Text>
      <Text style={styles.timer}>{questionTime}s</Text>
      <Text style={styles.question}>{question.question}</Text>

      {question.options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={getOptionStyle(opt.id)}
          onPress={() => handleSelect(opt.id)}
        >
          <Text style={styles.optionText}>{opt.text}</Text>
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

          <TouchableOpacity style={styles.confirm} onPress={handleExit}>
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