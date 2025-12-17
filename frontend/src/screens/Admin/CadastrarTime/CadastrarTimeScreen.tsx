import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../../navigation/types";
import styles from "./styles";
import teamService from "../../../services/teamService";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";

type NavigationProps = StackNavigationProp<AppStackParamList>;

export default function CadastrarTimeScreen() {

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permission.granted) {
            Alert.alert("Permissão necessária", "Permita acesso às imagens");
            return;
        }
        
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        
        if (!result.canceled) {
            setTeam({ ...team, badge: result.assets[0].uri });
        }
    };
      
    const navigation = useNavigation<NavigationProps>();

    const [team, setTeam] = useState({
        name: "",
        acronym: "",
        country: "",
        city: "",
        foundationYear: "",
        stadium: "",
        badge: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: string, value: string) => {
        setTeam({ ...team, [field]: value });
    };

    const handleSubmit = async () => {
        if (!team.name || !team.acronym || !team.country || !team.city || !team.foundationYear || !team.stadium) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const year = parseInt(team.foundationYear.replace(/\D/g, ""), 10);
        if (isNaN(year) || year < 1800) {
            Alert.alert("Erro", "Ano de fundação inválido. Deve ser um ano válido a partir de 1800.");
            return;
        }

        setIsLoading(true);
        try {
            await teamService.criarTime({
                nome: team.name,
                sigla: team.acronym,
                pais_origem: team.country,
                cidade_origem: team.city,
                ano_fundacao: year,
                estadio: team.stadium,
                escudo_url: team.badge || null,
            });

            Alert.alert("Sucesso", "Time cadastrado com sucesso!", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("AdminCreate"),
                },
            ]);
        } catch (error: any) {
            if (error.response?.status === 401) {
                Alert.alert(
                    "Erro de Autenticação",
                    "Você precisa estar logado como administrador para cadastrar times. Por favor, faça login novamente."
                );
            } else {
                Alert.alert("Erro", error.message || "Erro ao cadastrar time.");
            }
        } finally {
            setIsLoading(false);
        }
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
            <Text style={styles.headerTitle}>CADASTRAR TIME</Text>
        </View>

        <View style={styles.form}>
            <Text style={styles.label}>Nome do Time</Text>
            <TextInput style={styles.input} onChangeText={(v) => handleChange("name", v)} />

            <Text style={styles.label}>Sigla</Text>
            <TextInput style={styles.input} onChangeText={(v) => handleChange("acronym", v)} />

            <Text style={styles.label}>País de Origem</Text>
            <TextInput style={styles.input} onChangeText={(v) => handleChange("country", v)} />

            <Text style={styles.label}>Cidade de Origem</Text>
            <TextInput style={styles.input} onChangeText={(v) => handleChange("city", v)} />

            <Text style={styles.label}>Ano de Fundação</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={team.foundationYear}
                onChangeText={(text) => {
                    const cleaned = text.replace(/\D/g, "");
                    if (cleaned.length <= 4) {
                        handleChange("foundationYear", cleaned);
                    }
                }}
                maxLength={4}
                placeholder="Ex: 1905"
                placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Estádio</Text>
            <TextInput style={styles.input} onChangeText={(v) => handleChange("stadium", v)} />

            <TouchableOpacity 
                style={[styles.imageButton, styles.imageButtonDisabled]} 
                onPress={() => {}}
                disabled={true}
            >
                <Ionicons name="image-outline" size={20} color="#fff" />
                <Text style={styles.imageButtonText}>Selecionar Imagem</Text>
            </TouchableOpacity>

            {team.badge? (
                <Image source={{ uri: team.badge}}
                style={styles.preview} />
            ) : null}

            <TouchableOpacity 
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
                onPress={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitText}>Finalizar Cadastro</Text>
                )}
            </TouchableOpacity>
        </View>
        </ScrollView>
    );
}