import api from './api';

export interface QuizViewModel {
  id: number;
  nome_quiz: string;
  tema: string;
  tempo_por_questao_segundos: number;
  total_perguntas: number;
  valor_recompensa: number | null;
}

class QuizService {
  async listarQuizzes(): Promise<QuizViewModel[]> {
    try {
      const response = await api.get<QuizViewModel[]>('/quiz/list');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erro ao listar quizzes';
      throw new Error(errorMessage);
    }
  }
}

export default new QuizService();

