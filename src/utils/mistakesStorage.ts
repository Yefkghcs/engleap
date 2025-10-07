interface MistakeWord {
  id: number;
  word: string;
  tags: string[];
  phonetic: string;
  meaning: string;
  example: string;
  exampleCn: string;
  date: string; // YYYY-MM-DD format
  errorCount: number;
}

const STORAGE_KEY = 'vocabulary_mistakes';

export const getMistakes = (): MistakeWord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const addMistake = (word: {
  id: number;
  word: string;
  tags: string[];
  phonetic: string;
  meaning: string;
  example: string;
  exampleCn: string;
}): void => {
  const mistakes = getMistakes();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Check if word already exists for today
  const existingIndex = mistakes.findIndex(
    m => m.id === word.id && m.date === today
  );
  
  if (existingIndex >= 0) {
    // Increment error count if already exists today
    mistakes[existingIndex].errorCount += 1;
  } else {
    // Add new mistake
    mistakes.push({
      ...word,
      date: today,
      errorCount: 1,
    });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
};

export const getMistakesByDates = (dates: Date[]): MistakeWord[] => {
  if (dates.length === 0) return [];
  
  const mistakes = getMistakes();
  const dateStrings = dates.map(d => d.toISOString().split('T')[0]);
  
  return mistakes.filter(m => dateStrings.includes(m.date));
};

export const deleteMistakes = (ids: number[]): void => {
  const mistakes = getMistakes();
  const filtered = mistakes.filter(m => !ids.includes(m.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getAllMistakeDates = (): string[] => {
  const mistakes = getMistakes();
  const dates = new Set(mistakes.map(m => m.date));
  return Array.from(dates).sort((a, b) => b.localeCompare(a)); // Most recent first
};
