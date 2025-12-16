export type Quiz = {
    id: string;
    name: string;
    description: string;
    questionsIds: string[];
    timePerQuestion: number;
    teamId: string;
    hasReward: boolean;
    rewardValue?: number;
};  