export interface CustomWord {
  id: number;
  category: string;
  subcategory: string;
  word: string;
  meaning: string;
  example?: string;
  exampleCn?: string;
}

export interface CustomVocabulary {
  id: string;
  name: string;
  emoji: string;
  words: CustomWord[];
  createdAt: string;
}

const STORAGE_KEY = 'custom_vocabularies';

export const getCustomVocabularies = (): CustomVocabulary[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveCustomVocabulary = (vocabulary: CustomVocabulary) => {
  const vocabularies = getCustomVocabularies();
  const existingIndex = vocabularies.findIndex(v => v.id === vocabulary.id);
  
  if (existingIndex >= 0) {
    vocabularies[existingIndex] = vocabulary;
  } else {
    vocabularies.push(vocabulary);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vocabularies));
};

export const deleteCustomVocabulary = (id: string) => {
  const vocabularies = getCustomVocabularies();
  const filtered = vocabularies.filter(v => v.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getCustomVocabulary = (id: string): CustomVocabulary | null => {
  const vocabularies = getCustomVocabularies();
  return vocabularies.find(v => v.id === id) || null;
};
