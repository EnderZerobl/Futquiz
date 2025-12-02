import React from "react";
import { View, Text, Animated, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import arrowLeftCircle from "../../../assets/icons/Arrow left-circle.png";

const FilterSidebar = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const left = visible ? 0 : -200;

  return (
    <Animated.View style={[styles.sidebar, { left }]}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Image 
          source={arrowLeftCircle} 
          style={styles.closeIcon}
        />
      </TouchableOpacity>
      
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