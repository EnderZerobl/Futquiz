import { Quiz } from "../types/Quiz";

export const quizzesMock: Quiz[] = [];

export const addQuiz = (data: Omit<Quiz, "id">) => {
const newQuiz: Quiz = {
    id: Date.now().toString(),
    ...data,
};

quizzesMock.push(newQuiz);

console.log("Quiz criado:", newQuiz);
console.log("Lista de quizzes:", quizzesMock);
};  