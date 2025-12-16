import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

type PlayerResult = {
  id: string;
  name: string;
  points: number;
  time: string;
};

const rankingMock: PlayerResult[] = [
  { id: "1", name: "Laura Santos", points: 452, time: "3 min e 25 seg" },
  { id: "2", name: "Laura Santos", points: 431, time: "3 min e 40 seg" },
  { id: "3", name: "Laura Santos", points: 414, time: "3 min e 55 seg" },
  { id: "4", name: "Laura Santos", points: 401, time: "4 min" },
];

export default function QuizResultScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>QUIZ GERAL TIMES</Text>

        <View style={styles.timer}>
          <Ionicons name="time" size={14} color="#fff" />
          <Text style={styles.timerText}>00:05</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>RANKING FINAL</Text>

      <FlatList
        data={rankingMock}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.rankCard}>
            <View style={styles.rankLeft}>
              <Image
                source={{ uri: "https://i.pravatar.cc/100" }}
                style={styles.avatar}
              />
              <Text style={styles.playerName}>{item.name}</Text>
            </View>

            <View style={styles.rankRight}>
              <Text style={styles.points}>{item.points} pontos</Text>
              {item.time && <Text style={styles.time}>{item.time}</Text>}
            </View>

            <View style={styles.position}>
              <Text style={styles.positionText}>{index + 1}º</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}