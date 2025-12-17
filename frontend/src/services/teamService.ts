import api from './api';

export interface TeamViewModel {
  id: number;
  nome: string;
  sigla: string;
  pais_origem: string;
  cidade_origem: string;
  ano_fundacao: number;
  estadio: string;
  escudo_url?: string | null;
}

export interface TeamInput {
  nome: string;
  sigla: string;
  pais_origem: string;
  cidade_origem: string;
  ano_fundacao: number;
  estadio: string;
  escudo_url?: string | null;
}

class TeamService {
  async listarTimes(): Promise<TeamViewModel[]> {
    try {
      const response = await api.get<TeamViewModel[]>('/teams/list');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erro ao listar times';
      throw new Error(errorMessage);
    }
  }

  async criarTime(team: TeamInput): Promise<TeamViewModel> {
    try {
      const response = await api.post<TeamViewModel>('/teams/create', team);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erro ao criar time';
      throw new Error(errorMessage);
    }
  }
}

export default new TeamService();

