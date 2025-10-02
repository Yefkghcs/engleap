import { getMistakes } from './mistakesStorage';

// In a real app, this would come from a backend or more sophisticated storage
// For now, we'll use the same approach as the VocabularyBook page
export const getTotalWords = (bookId: string): number => {
  // This matches the initialWordData in VocabularyBook
  // In production, this would be fetched from a database
  const wordCounts: Record<string, number> = {
    ielts: 4, // Current actual data
    toefl: 4,
    kaoyan: 4,
    sat: 4,
    gre: 4,
    cet6: 4,
    cet4: 4,
    college: 4,
    special: 4,
    highschool: 4,
    middleschool: 4,
    elementary: 4,
    nce: 4,
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
