export type AuthStackParamList = {
  SplashScreen: undefined; 
  WelcomeScreen: undefined; 
  LoginScreen: undefined; 
  RegisterScreen: undefined; 
  ForgotPassword: undefined; 
};

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
    quizId: string
  };
  QuizQuestion: {
    index: number
  };
  ProfileScreen: undefined;
  ConvidarUsuario: undefined;
  EditarDados: undefined;
};