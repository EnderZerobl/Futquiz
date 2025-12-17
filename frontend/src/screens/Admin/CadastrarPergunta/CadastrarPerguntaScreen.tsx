import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import teamService, { TeamViewModel } from "../../../services/teamService";
import perguntaService from "../../../services/perguntaService";
import { QuestionOption } from "../../../types/Question";

export default function CadastrarPerguntaScreen() {
  const navigation = useNavigation();
  const [teams, setTeams] = useState<TeamViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
    { id: "3", text: "" },
    { id: "4", text: "" },
  ]);  
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [duplicateOptions, setDuplicateOptions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setIsLoadingTeams(true);
      const teamsFromApi = await teamService.listarTimes();
      setTeams(teamsFromApi);
    } catch (error) {
      console.error("Erro ao carregar times:", error);
      Alert.alert("Erro", "Não foi possível carregar os times.");
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const toggleTag = (teamId: number) => {
    setSelectedTags((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const removeTag = (teamId: number) => {
    setSelectedTags((prev) => prev.filter((id) => id !== teamId));
  };

  const checkDuplicates = (currentOptions: QuestionOption[]) => {
    const textMap = new Map<string, string[]>();
    
    currentOptions.forEach((opt) => {
      const normalizedText = opt.text.trim().toLowerCase();
      if (normalizedText) {
        if (!textMap.has(normalizedText)) {
          textMap.set(normalizedText, []);
        }
        textMap.get(normalizedText)!.push(opt.id);
      }
    });
    
    const duplicates = new Set<string>();
    textMap.forEach((ids) => {
      if (ids.length > 1) {
        ids.forEach((id) => duplicates.add(id));
      }
    });
    
    setDuplicateOptions(duplicates);
  };

  const handleOptionChange = (optionId: string, value: string) => {
    const updatedOptions = options.map((opt) =>
      opt.id === optionId ? { ...opt, text: value } : opt
    );
    setOptions(updatedOptions);
    checkDuplicates(updatedOptions);
  };

  const handleToggleCorrect = (optionId: string) => {
    if (correctOptionId === optionId) {
      setCorrectOptionId(null);
    } else {
      setCorrectOptionId(optionId);
    }
  };

  const handleSubmit = async () => {
    if (
      !question ||
      options.some((opt) => !opt.text) ||
      !correctOptionId ||
      selectedTags.length === 0
    ) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    if (duplicateOptions.size > 0) {
      return;
    }

    const correctOptionIndex = options.findIndex((opt) => opt.id === correctOptionId);
    if (correctOptionIndex === -1) {
      Alert.alert("Erro", "Selecione uma opção correta.");
      return;
    }

    setIsLoading(true);
    try {
      const perguntaData = {
        texto: question,
        opcoes: options.map((opt) => opt.text),
        indice_opcao_correta: correctOptionIndex,
        tempo_quiz_segundos: 20,
        tags: selectedTags.map((id) => id.toString()),
      };
      
      await perguntaService.criarPergunta(perguntaData);

      Alert.alert("Sucesso", "Pergunta cadastrada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("AdminCreate"),
        },
      ]);
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert(
          "Erro de Autenticação", 
          "Você precisa estar logado como administrador para cadastrar perguntas. Por favor, faça login novamente."
        );
      } else {
        Alert.alert("Erro", error.message || "Erro ao cadastrar pergunta.");
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
        <Text style={styles.headerTitle}>CADASTRAR PERGUNTA / RESPOSTA</Text>
      </View>
  
      <Text style={styles.label}>Pergunta</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="Digite a pergunta"
        placeholderTextColor="#fff"
      />
  
      <Text style={styles.label}>Alternativas</Text>
  
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isCorrect = correctOptionId === option.id;
          const isDuplicate = duplicateOptions.has(option.id);
          
          return (
            <View
              key={option.id}
              style={[
                styles.optionBox,
                isCorrect && styles.correctOption,
                isDuplicate && styles.duplicateOption,
              ]}
            >
              <Text style={styles.optionLabel}>OPÇÃO {index + 1}</Text>
  
              <TextInput
                style={styles.optionInput}
                value={option.text}
                onChangeText={(text) => handleOptionChange(option.id, text)}
                placeholder={`Digite a opção ${index + 1}`}
                placeholderTextColor="#fff"
              />
              
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleToggleCorrect(option.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, isCorrect && styles.checkboxChecked]}>
                  {isCorrect && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Resposta correta</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
  
      <Text style={styles.label}>Tags</Text>
      
      {selectedTags.length > 0 && (
        <View style={styles.selectedTagsContainer}>
          {selectedTags.map((teamId) => {
            const team = teams.find((t) => t.id === teamId);
            if (!team) return null;
            return (
              <View key={teamId} style={styles.selectedTag}>
                <TouchableOpacity
                  style={styles.removeTagButton}
                  onPress={() => removeTag(teamId)}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
                {team.escudo_url && (
                  <Image
                    source={{ uri: team.escudo_url }}
                    style={styles.tagImage}
                  />
                )}
                <Text style={styles.selectedTagText}>{team.nome}</Text>
              </View>
            );
          })}
        </View>
      )}

      {isLoadingTeams ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.loadingText}>Carregando times...</Text>
        </View>
      ) : (
        <View style={styles.tagsContainer}>
          {teams
            .filter((team) => !selectedTags.includes(team.id))
            .map((team) => (
              <TouchableOpacity
                key={team.id}
                style={styles.tag}
                onPress={() => toggleTag(team.id)}
              >
                {team.escudo_url && (
                  <Image
                    source={{ uri: team.escudo_url }}
                    style={styles.tagImage}
                  />
                )}
                <Text style={styles.tagText}>{team.nome}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
  
      <TouchableOpacity 
        style={[
          styles.submitButton, 
          (isLoading || duplicateOptions.size > 0) && styles.submitButtonDisabled
        ]} 
        onPress={handleSubmit}
        disabled={isLoading || duplicateOptions.size > 0}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Finalizar Cadastro</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );  
}