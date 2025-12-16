import { Question } from "../types/Question";

export const questionsMock: Question[] = [];

export const addQuestion = (data: Omit<Question, "id">) => {
  const newQuestion: Question = {
    id: Date.now().toString(),
    ...data,
  };

  questionsMock.push(newQuestion);

  console.log("Pergunta cadastrada:", newQuestion);
  console.log("Lista de perguntas:", questionsMock);
};

export const getQuestions = () => questionsMock;