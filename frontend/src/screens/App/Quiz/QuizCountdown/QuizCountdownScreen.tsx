import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../../../navigation";

type NavigationProps = StackNavigationProp<AppStackParamList, "QuizCountdown">;

export default function QuizCountdownScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds === 0) {
      navigation.replace("QuizQuestion", { index: 0 });
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BOA SORTE!</Text>
      <Text style={styles.subtitle}>QUIZ COMEÇANDO EM</Text>
      <Text style={styles.counter}>{seconds}</Text>
    </View>
  );
}