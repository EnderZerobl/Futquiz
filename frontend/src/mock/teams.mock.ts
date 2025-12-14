export type Team = {
    id: string;
    name: string;
    acronym: string;
    country: string;
    city: string;
    foundationYear: string;
    stadium: string;
    badge?: string;
};

export const teams: Team[] = [];

export const addTeam = (team: Omit<Team, "id">) => {
    teams.push({
        ...team,
        id: Date.now().toString(),
    });
};

export const getTeams = () => teams;