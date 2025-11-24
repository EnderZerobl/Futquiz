import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./styles";

const QuizCard = ({ item, expanded, onPress }: any) => {
  return (
    <TouchableOpacity style={styles.quizCard} onPress={onPress} activeOpacity={0.9}>
      <Image source={ item.image } style={styles.quizImage} />

      <View style={{ flex: 1 }}>
        <Text style={styles.quizTitle}>{item.title}</Text>

        <Text style={styles.quizDescription} numberOfLines={expanded ? 6 : 2}>
          {item.description}
        </Text>

        <View style={styles.tagContainer}>
          <Text style={styles.quizTag}>{item.tag}</Text>
        </View>

        {expanded && (
          <TouchableOpacity style={styles.buttonStart}>
            <Text style={styles.buttonStartText}>Entrar na sala de espera</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default QuizCard;