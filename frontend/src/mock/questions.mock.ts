export type Question = {
    id: string;
    question: string;
    options: string[];
    tags: string[];
};

export const questions: Question[] = [];

export const addQuestion = (data: Omit<Question, "id">) => {
const newQuestion: Question = {
    id: Date.now().toString(),
    ...data,
};

questions.push(newQuestion);

console.log("Pergunta cadastrada:", newQuestion);
console.log("Lista de perguntas:", questions);
};

export const getQuestions = () => questions;  