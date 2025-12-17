import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../../navigation/types";
import warningIcon from "../../../../assets/icons/warning.png";
import styles from "./styles";

type NavigationProps = StackNavigationProp<AppStackParamList>;

export default function CriarQuizStepOneScreen() {
  const navigation = useNavigation<NavigationProps>();

  const [hasReward, setHasReward] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timePerQuestion, setTimePerQuestion] = useState("");

  const handleNext = () => {
    if (!title.trim() || !timePerQuestion.trim()) {
      return;
    }

    navigation.navigate("CriarQuizStepTwo", {
        title,
        description,
        timePerQuestion,
        hasReward,
    });
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
            <Text style={styles.headerTitle}>CRIAR QUIZ</Text>
            <View style={{ width: 24 }} />
        </View>

        <TouchableOpacity onPress={() => setHasReward(false)}>
            <Text style={styles.radio}>{!hasReward ? "◉" : "○"} SEM RECOMPENSA</Text>
        </TouchableOpacity>

        <View style={styles.disabledOption}>
            <Text style={styles.radioDisabled}>○ COM RECOMPENSA <Text style={styles.comingSoon}>(em breve)</Text></Text>
        </View>

        <Text style={styles.label}>Nome</Text>
        <TextInput
            style={styles.input}
            placeholder="Digite o nome do quiz"
            placeholderTextColor="#E8FFF3"
            value={title}
            onChangeText={setTitle}
        />
        {!title.trim() && (
          <View style={styles.hintContainer}>
            <Image source={warningIcon} style={styles.warningIcon} />
            <Text style={styles.hint}>Deve haver um nome para o quiz</Text>
          </View>
        )}

        <Text style={styles.label}>Descrição</Text>
        <TextInput
            style={styles.input}
            placeholder="Descreva o quiz"
            placeholderTextColor="#E8FFF3"
            value={description}
            onChangeText={setDescription}
        />

        <Text style={styles.label}>Tempo das perguntas</Text>
        <TextInput
            style={styles.input}
            placeholder="Digite o tempo em segundos"
            placeholderTextColor="#E8FFF3"
            value={timePerQuestion}
            onChangeText={setTimePerQuestion}
            keyboardType="numeric"
        />
        {!timePerQuestion.trim() && (
          <View style={styles.hintContainer}>
            <Image source={warningIcon} style={styles.warningIcon} />
            <Text style={styles.hint}>Deve haver um tempo para as perguntas</Text>
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
            <Text style={styles.submitText}>Avançar</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}