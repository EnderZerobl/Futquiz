import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import QuizCard from "../../../components/QuizCard";
import FilterSidebar from "../../../components/FilterSidebar";
import FooterNavigation from "../../../components/FooterNavigation";
import { quizzesMock } from "../../../mock/quiz.mock";
import { getTeams } from "../../../mock/teams.mock";

import styles from "./styles";

export default function HomeScreen() {
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const [quizzes, setQuizzes] = useState(quizzesMock);
  const teams = getTeams();
  
  useFocusEffect(
    React.useCallback(() => {
      setQuizzes([...quizzesMock]);
    }, [])
  );

  const availableTags = teams.map((team) => ({
    id: team.id,
    name: team.name,
  }));

  const fullName = "User";
  const emailUpper = "USER@GMAIL.COM";

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

        {quizzes.length === 0? (
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
                  title={item.name}
                  description={item.description}
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

      <FooterNavigation role="ADMIN" />
    </View>
  )
}