export type QuestionOption = {
    id: string;
    text: string;
};

export type Question = {
    id: string;
    question: string;
    options: QuestionOption[];
    correctOptionId: string;
    tags: string[];
};  