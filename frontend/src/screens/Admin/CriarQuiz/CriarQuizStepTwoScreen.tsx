import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../../navigation/types";
import perguntaService, { Pergunta } from "../../../services/perguntaService";
import quizService from "../../../services/quizService";
import styles from "./styles";

type NavigationProps = StackNavigationProp<AppStackParamList>;

export default function CriarQuizStepTwoScreen() {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<any>();
    const { title, description, timePerQuestion, hasReward } = route.params;

    const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadPerguntas();
    }, []);

    const loadPerguntas = async () => {
        try {
            setLoading(true);
            const perguntasFromApi = await perguntaService.listarPerguntas();
            setPerguntas(perguntasFromApi);
        } catch (error) {
            console.error("Erro ao carregar perguntas:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestion = (id: number) => {
        setSelectedQuestions((prev) =>
            prev.includes(id)
                ? prev.filter((q) => q !== id)
                : [...prev, id]
        );
    };

    const handleCreateQuiz = async () => {
        if (selectedQuestions.length === 0) {
            Alert.alert("Atenção", "Selecione pelo menos uma pergunta para criar o quiz.");
            return;
        }

        const tempo = parseInt(timePerQuestion, 10);
        if (isNaN(tempo) || tempo < 10 || tempo > 60) {
            Alert.alert("Erro", "O tempo por questão deve estar entre 10 e 60 segundos.");
            return;
        }

        setIsCreating(true);
        try {
            await quizService.criarQuiz({
                nome_quiz: title,
                tema: description || title,
                tempo_por_questao_segundos: tempo,
                pergunta_ids: selectedQuestions,
                valor_recompensa: hasReward ? null : null,
            });

            navigation.navigate("AdminCreate");
            Alert.alert("Sucesso", "Quiz criado com sucesso!");
        } catch (error: any) {
            if (error.response?.status === 401) {
                Alert.alert(
                    "Erro de Autenticação",
                    "Você precisa estar logado como administrador para criar quizzes. Por favor, faça login novamente."
                );
            } else {
                Alert.alert("Erro", error.message || "Erro ao criar quiz.");
            }
        } finally {
            setIsCreating(false);
        }
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
            <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Carregando perguntas...</Text>
          </View>
        ) : perguntas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Não possui perguntas cadastradas</Text>
            <TouchableOpacity 
              style={styles.cadastrarButton}
              onPress={() => navigation.navigate("CadastrarPergunta")}
            >
              <Text style={styles.cadastrarButtonText}>Cadastrar Pergunta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          perguntas.map((pergunta) => (
            <TouchableOpacity
              key={pergunta.id}
              style={styles.questionCard}
              onPress={() => toggleQuestion(pergunta.id)}
            >
              <Text style={styles.questionText}>{pergunta.texto}</Text>
              <Ionicons
                name={selectedQuestions.includes(pergunta.id) ? "checkmark-circle" : "checkmark-circle-outline"}
                size={24}
                color={selectedQuestions.includes(pergunta.id) ? "#fff" : "#ccc"}
              />
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity 
            style={[styles.submitButton, isCreating && styles.submitButtonDisabled]} 
            onPress={handleCreateQuiz}
            disabled={isCreating || selectedQuestions.length === 0}
        >
            {isCreating ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.submitText}>Criar Quiz</Text>
            )}
        </TouchableOpacity>
        </ScrollView>
    );
}