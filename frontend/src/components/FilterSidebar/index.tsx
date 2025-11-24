import React from "react";
import { View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

const FilterSidebar = ({ visible }: { visible: boolean }) => {
  const left = visible ? 0 : -200;

  return (
    <Animated.View style={[styles.sidebar, { left }]}>
      <Text style={styles.sidebarTitle}>Filtrar:</Text>

      <View style={styles.filterItem}>
        <Ionicons name="football" size={16} color="#fff" />
        <Text style={styles.filterText}>Esporte Clube Vitória</Text>
      </View>

      <View style={styles.filterItem}>
        <Ionicons name="flame" size={16} color="#fff" />
        <Text style={styles.filterText}>Flamengo</Text>
      </View>

      <View style={styles.filterItem}>
        <Ionicons name="shield" size={16} color="#fff" />
        <Text style={styles.filterText}>Corinthians</Text>
      </View>
    </Animated.View>
  )
}

export default FilterSidebar;