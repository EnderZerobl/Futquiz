import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import QuizCard from "../../../components/QuizCard";
import FilterSidebar from "../../../components/FilterSidebar";
import FooterNavigation from "../../../components/FooterNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { getTeams } from "../../../mock/teams.mock";
import quizService, { QuizViewModel } from "../../../services/quizService";
import { Quiz } from "../../../types/Quiz";

import styles from "./styles";

export default function HomeScreen() {
  const { user } = useAuth();
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const teams = getTeams();

  const mapQuizViewModelToQuiz = (quizViewModel: QuizViewModel): Quiz => {
    const team = teams.find((t) => t.name.toLowerCase() === quizViewModel.tema.toLowerCase());
    
    return {
      id: quizViewModel.id.toString(),
      name: quizViewModel.nome_quiz,
      description: quizViewModel.tema || quizViewModel.nome_quiz,
      questionsIds: [],
      timePerQuestion: quizViewModel.tempo_por_questao_segundos,
      teamId: team?.id || quizViewModel.tema || "",
      hasReward: quizViewModel.valor_recompensa !== null && quizViewModel.valor_recompensa > 0,
      rewardValue: quizViewModel.valor_recompensa || undefined,
    };
  };

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const quizzesFromApi = await quizService.listarQuizzes();
      const mappedQuizzes = quizzesFromApi.map(mapQuizViewModelToQuiz);
      setQuizzes(mappedQuizzes);
    } catch (error) {
      console.error("Erro ao carregar quizzes:", error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadQuizzes();
    }, [])
  );

  const availableTags = teams.map((team) => ({
    id: team.id,
    name: team.name,
  }));

  const fullName = user ? `${user.name} ${user.last_name}` : 'Usuário';
  const emailUpper = user ? user.email.toUpperCase() : '';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FilterSidebar visible={filterOpen} onClose={() => setFilterOpen(false)} teams={teams}/>

        <View style={styles.header}>
          <View>
            <Text style={styles.headerHello}>OLÁ,</Text>
            <Text style={styles.headerName}>{fullName || 'Usuário'}</Text>
            <Text style={styles.headerEmail}>{emailUpper || ''}</Text>
          </View>

          <Ionicons name="person-circle" size={45} color="#fff" />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterOpen(!filterOpen)}
        >
          <Ionicons name="filter" size={18} color="#fff" />
          <Text style={styles.filterLabel}>Filtrar</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.emptyText}>Carregando quizzes...</Text>
          </View>
        ) : quizzes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Sem quiz disponível no momento.
            </Text>
          </View>
        ) : (
          <FlatList
            data={quizzes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const team = teams.find((t) => t.id === item.teamId);

              return(
                <QuizCard
                  quiz={item}
                  teamName={team?.name}
                  badge={team?.badge}
                  expanded={expandedQuizId == item.id}
                  onPress={() =>
                    setExpandedQuizId(expandedQuizId === item.id ? null : item.id)
                  }
                />
              )              
            }}
          />
        )}        
      </View>

      <FooterNavigation role={user?.is_admin ? "ADMIN" : "USER"} />
    </View>
  )
}