import { Quiz } from "../types/Quiz";

export const quizzesMock: Quiz[] = [
    {
        id: "quiz-1",
        name: "Quiz Brasileirão",
        description: "Teste seus conhecimentos sobre o Brasileirão Série A",
        questionsIds: [
            "q1",
            "q2",
            "q3"
        ],
        timePerQuestion: 15,
        teamId: "team-1",
        hasReward: false,
    },
    {
        id: "quiz-2",
        name: "Quiz Flamengo",
        description: "Você realmente conhece o Flamengo?",
        questionsIds: [
            "q4",
            "q5",
            "q6"
        ],
        timePerQuestion: 10,
        teamId: "team-2",
        hasReward: true,
        rewardValue: 50,
    }
];

export const getQuizzes = () => quizzesMock;

export const getQuizById = (id: string) =>
    quizzesMock.find((quiz) => quiz.id === id);

// export const quizzesMock: Quiz[] = [];

// export const addQuiz = (data: Omit<Quiz, "id">) => {
// const newQuiz: Quiz = {
//     id: Date.now().toString(),
//     ...data,
// };

// quizzesMock.push(newQuiz);

// console.log("Quiz criado:", newQuiz);
// console.log("Lista de quizzes:", quizzesMock);
// };  