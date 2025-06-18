export interface Flashcard {
  id: number;
  question: string;
  choices: string[];
  correctIndex: number;
  userAnswer?: number | null;
  postponed?: boolean;
}
