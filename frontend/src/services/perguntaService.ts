import api from './api';

export interface PerguntaInput {
  texto: string;
  opcoes: string[];
  indice_opcao_correta: number;
  tempo_quiz_segundos?: number;
}

export interface Pergunta {
  id: number;
  texto: string;
  opcoes: string[];
  tempo_quiz_segundos: number;
}

class PerguntaService {
  async listarPerguntas(): Promise<Pergunta[]> {
    try {
      const response = await api.get<Pergunta[]>('/perguntas/list');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erro ao listar perguntas';
      throw new Error(errorMessage);
    }
  }

  async criarPergunta(pergunta: PerguntaInput): Promise<Pergunta> {
    try {
      const response = await api.post<Pergunta>('/perguntas/create', pergunta);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erro ao criar pergunta';
      throw new Error(errorMessage);
    }
  }
}

export default new PerguntaService();

