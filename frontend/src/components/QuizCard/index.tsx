import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

const QuizCard = ({ item, expanded, onPress }: any) => {
  if (expanded) {
    return (
      <TouchableOpacity style={styles.quizCardExpanded} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.expandedTopSection}>
          <Image 
            source={item.image} 
            style={styles.expandedImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.expandedBottomSection}>
          <Text style={styles.expandedTitle}>{item.title}</Text>
          <Text style={styles.expandedDescription}>{item.description}</Text>
          
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
          source={ item.image } 
          style={styles.quizImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.contentTop}>
          <Text style={styles.quizTitle}>{item.title}</Text>

          <Text style={styles.quizDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={styles.tagContainer}>
          <Ionicons name="close-circle" size={16} color="#fff" />
          <Image 
            source={item.image} 
            style={styles.tagImage}
            resizeMode="contain"
          />
          <Text style={styles.quizTag}>{item.tag}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default QuizCard;