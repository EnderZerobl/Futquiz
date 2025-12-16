import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

type Props = {
  title: string,
  description: string,
  teamName?: string,
  badge?: string;
  expanded: boolean;
  onPress: () => void;
}

const QuizCard = ({ title, description, teamName, badge, expanded, onPress }: Props) => {
  if (expanded) {
    return (
      <TouchableOpacity style={styles.quizCardExpanded} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.expandedTopSection}>
          {badge && 
            <Image 
              source={{ uri: badge }} 
              // style={styles.badge}
              // resizeMode="contain"
              resizeMode="stretch"
            />
          }          
        </View>

        <View style={styles.expandedBottomSection}>
          <Text style={styles.expandedTitle}>{title}</Text>
          <Text style={styles.expandedDescription}>{description}</Text>
          
          <TouchableOpacity style={styles.buttonStart} onPress={(e) => e.stopPropagation()}>
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.buttonStartText}>Entrar na sala de espera</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.quizCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: badge }}
          style={styles.quizImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.contentTop}>
          <Text style={styles.quizTitle}>{title}</Text>

          <Text style={styles.quizDescription} numberOfLines={2}>
            {description}
          </Text>
        </View>

        {teamName && (
          <View style={styles.tagContainer}>
            <Ionicons name="close-circle" size={16} color="#fff" />
            <Image 
              source={{ uri: badge }} 
              style={styles.tagImage}
              resizeMode="contain"
            />
            <Text style={styles.quizTag}>{teamName}</Text>
          </View>
        )}
        
      </View>
    </TouchableOpacity>
  )
}

export default QuizCard;