import type { Flashcard } from "./types";

export async function fetchFlashcards(): Promise<Flashcard[]> {
  const res = await fetch(
    "https://fh-salzburg-3e27a-default-rtdb.europe-west1.firebasedatabase.app/flashcards.json"
  );
  const data = await res.json();

  return data
    ? Object.values(data).map((card: any, index: number) => ({
        ...card,
        id: index + 1,
        userAnswer: null,
      }))
    : [];
}
