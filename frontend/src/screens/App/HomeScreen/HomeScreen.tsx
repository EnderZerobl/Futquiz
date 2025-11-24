import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import QuizCard from "../../../components/QuizCard";
import FilterSidebar from "../../../components/FilterSidebar";
import FooterNavigation from "../../../components/FooterNavigation";
import { quizListMock } from "../../../mock/quizListMock";

import styles from "./styles";

export default function HomeScreen() {
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        
        {/* Sidebar */}
        <FilterSidebar visible={filterOpen} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerHello}>OLÁ,</Text>
            <Text style={styles.headerName}>Laura Santos</Text>
            <Text style={styles.headerEmail}>LAURASANTOSS2@GMAIL.COM</Text>
          </View>

          <Ionicons name="person-circle" size={45} color="#fff" />
        </View>

        {/* Filtro */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterOpen(!filterOpen)}
        >
          <Ionicons name="filter" size={18} color="#fff" />
          <Text style={styles.filterLabel}>Filtrar</Text>
        </TouchableOpacity>

        {/* Lista de cards */}
        <FlatList
          data={quizListMock}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <QuizCard
              item={item}
              expanded={expandedQuizId === item.id}
              onPress={() =>
                setExpandedQuizId(expandedQuizId === item.id ? null : item.id)
              }
            />
          )}
        />
      </View>

      {/* Footer */}
      <FooterNavigation />
    </View>
  )
}