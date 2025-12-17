import { Team } from "../types/Team";

export const teams: Team[] = [];

export const addTeam = (team: Omit<Team, "id">) => {
    teams.push({
        ...team,
        id: Date.now().toString(),
    });
};

export const getTeams = () => teams;