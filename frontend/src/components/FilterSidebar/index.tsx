import React from "react";
import { View, Text, Animated, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import arrowLeftCircle from "../../../assets/icons/Arrow left-circle.png";
import { Team } from "../../types/Team";

type Props = {
  visible: boolean;
  onClose: () => void;
  teams: Team[];
};

const FilterSidebar = ({ visible, onClose, teams }: Props) => {
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

      {teams.length === 0 ? (
        <Text>
          Nenhuma tag cadastrada
        </Text>
      ) : (
        teams.map((team) => (
          <TouchableOpacity key={team.id} style={styles.tagItem}>
            <Text style={styles.tagText}>{team.name}</Text>
          </TouchableOpacity>
        ))
      )}
    </Animated.View>
  )
}

export default FilterSidebar;