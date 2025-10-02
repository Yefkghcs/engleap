import { getMistakes } from './mistakesStorage';

// In a real app, this would come from a backend or more sophisticated storage
// For now, we'll use the same approach as the VocabularyBook page
export const getTotalWords = (bookId: string): number => {
  // Only IELTS has words currently
  const wordCounts: Record<string, number> = {
    ielts: 100, // Updated to 100 words
    toefl: 0,
    kaoyan: 0,
    sat: 0,
    gre: 0,
    cet6: 0,
    cet4: 0,
    college: 0,
    special: 0,
    highschool: 0,
    middleschool: 0,
    elementary: 0,
    nce: 0,
  };
  
  return wordCounts[bookId] || 0;
};

export const getLearnedWordsCount = (): number => {
  // Get from localStorage if you're tracking word statuses
  const stored = localStorage.getItem('vocabulary_word_statuses');
  if (!stored) return 0;
  
  try {
    const statuses = JSON.parse(stored);
    // Count words that are marked as "known" or "unknown"
    return Object.values(statuses).filter(
      (status) => status === 'known' || status === 'unknown'
    ).length;
  } catch {
    return 0;
  }
};

export const getMistakesCount = (): number => {
  const mistakes = getMistakes();
  // Count unique words (not counting duplicates from different dates)
  const uniqueWords = new Set(mistakes.map(m => m.id));
  return uniqueWords.size;
};

export const getTotalLearnedWords = (): number => {
  // In a real app, this would aggregate across all books
  // For now, we'll return the count from the current session
  return getLearnedWordsCount();
};
