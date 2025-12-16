import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { addTeam } from "../../../mock/teams.mock";
import * as ImagePicker from "expo-image-picker";
import { Image, Alert} from "react-native";

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
      
    const navigation = useNavigation();

    const [team, setTeam] = useState({
        name: "",
        acronym: "",
        country: "",
        city: "",
        foundationYear: "",
        stadium: "",
        badge: "",
    });

    const handleChange = (field: string, value: string) => {
        setTeam({ ...team, [field]: value });
    };

    const handleSubmit = () => {
        addTeam(team);
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                // onChangeText={(v) => handleChange("foundationYear", v)}
                onChangeText={(text) => {
                    const cleaned = text.replace(/\D/g, "");
                    let formatted = cleaned;
                    if (cleaned.length >= 3)
                        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
                    if (cleaned.length >= 5)
                        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
                    handleChange("foundationYear", formatted)
                    // setFoundationYear(formatted);
                }}
            />

            <Text style={styles.label}>Estádio</Text>
            <TextInput style={styles.input} onChangeText={(v) => handleChange("stadium", v)} />

            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={20} color="#fff" />
                <Text style={styles.imageButtonText}>Selecionar Imagem</Text>
            </TouchableOpacity>

            {team.badge? (
                <Image source={{ uri: team.badge}}
                style={styles.preview} />
            ) : null}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Finalizar Cadastro</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    );
}