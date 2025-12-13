import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import FooterNavigation from "../../../components/FooterNavigation";

const AdminCreateScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>      
        <View style={styles.header}>
          <View>
            <Text style={styles.role}>ADMIN</Text>
            <Text style={styles.name}>Maria Silva</Text>
            <Text style={styles.email}>MARIASILVA@SOCCERQUIZ.COM</Text>
          </View>

          <View style={styles.avatar}>
            <Ionicons name="person" size={26} color="#2ECC71" />
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTag}>INSERÇÃO</Text>
            <Text style={styles.cardTitle}>Cadastrar Time</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTag}>INSERÇÃO</Text>
            <Text style={styles.cardTitle}>Cadastrar Pergunta/Resposta</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FooterNavigation role="ADMIN" />
    </View>

  );
};

export default AdminCreateScreen;
