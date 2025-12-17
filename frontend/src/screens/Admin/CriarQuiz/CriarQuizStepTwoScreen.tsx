import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getQuestions } from "../../../mock/questions.mock";
import { addQuiz } from "../../../mock/quiz.mock";
import styles from "./styles";
import { quizzesMock } from "../../../mock/quiz.mock";

export default function CriarQuizStepTwoScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { title, description, timePerQuestion, hasReward, teamId } = route.params;

    const questions = getQuestions().filter((q) => q.tags.includes(teamId));
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

    const toggleQuestion = (id: string) => {
        setSelectedQuestions((prev) =>
        prev.includes(id)
            ? prev.filter((q) => q !== id)
            : [...prev, id]
        );
    };

    const handleCreateQuiz = () => {
        if (selectedQuestions.length === 0) return;

        addQuiz({
            name: title,
            description,
            questionsIds: selectedQuestions,
            timePerQuestion,
            teamId,
            hasReward,
        });

        navigation.navigate("HomeScreen" as never);
    };

    return (
        <ScrollView 
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>SELECIONAR PERGUNTAS</Text>
        </View>
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