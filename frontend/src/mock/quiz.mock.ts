export type Quiz = {
    id: string;
    title: string;
    hasReward: boolean;
    price?: string;
    timePerQuestion: string;
    tag: string;
    questions: string[];
};

export const quizzes: Quiz[] = [];

export const addQuiz = (data: Omit<Quiz, "id">) => {
const newQuiz: Quiz = {
    id: Date.now().toString(),
    ...data,
};

quizzes.push(newQuiz);

console.log("Quiz criado:", newQuiz);
console.log("Lista de quizzes:", quizzes);
};  