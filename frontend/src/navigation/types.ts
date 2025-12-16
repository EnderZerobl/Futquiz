export type AuthStackParamList = {
  SplashScreen: undefined; 
  WelcomeScreen: undefined; 
  LoginScreen: undefined; 
  RegisterScreen: undefined; 
  ForgotPassword: undefined; 
};

import { Quiz } from "../types/Quiz";
import { Question } from "../types/Question";

export type AppStackParamList = {
  HomeScreen: undefined;
  AdminCreate: undefined;
  CadastrarTime: undefined;
  CadastrarPergunta: undefined;
  CriarQuizStepOne: undefined;
  CriarQuizStepTwo: {
    hasReward: boolean;
    title: string;
    tag: string;
    timePerQuestion: string;
  };
  QuizWaitingRoom: {
    quizId: string
  };
  QuizCountdown: {
    quiz: Quiz;
    questions: Question[];
  };
  QuizQuestion: {
    quiz: Quiz;
    questions: Question[];
  };
  QuizResult: {
    quizId: string;
    score: number;
    totalTime: number;
  };
};