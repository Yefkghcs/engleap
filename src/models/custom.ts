import { create } from 'zustand';
import { format } from "date-fns";
import fetch from '@/utils/fetch';
import { WordsMapItem, WordStatus } from './word';

export interface CustomCategory {
    category: string;
    categoryName: string;
    subcategory: string;
    subcategoryName: string;
    emoji: string;
    wordCount: number;
}

export interface CustomWord {
  id: number;
  word: string;
  meaning: string;
  example?: string;
  exampleCn?: string;
}

export interface CustomData {
    customCategories: CustomCategory[];
    customWordsMap: {
        data: WordsMapItem[];
        total: number;
        pages: number;
        limit: number;
        known: number;
        unknown: number;
    };
    addCustomData: ({
        category, categoryName, subcategory, subcategoryName, emoji, words
    } : {
        category: string;
        categoryName: string;
        subcategory: string;
        subcategoryName: string;
        emoji: string;
        words: CustomWord[];
    }) => Promise<void>;
    deleteCustomData: (subcategory: string) => Promise<void>;
    getCustomCategories: () => Promise<void>;
    getCustomWords: ({subcategory, page, limit, status}: {
        subcategory: string;
        page: number;
        limit: number;
        status: WordStatus;
    }) => Promise<void>;
    updateCustomWordStatus: ({category, subcategory, id, status}: {
        category: string, subcategory: string, id: number, status: WordStatus
    }) => Promise<void>;
    addCustomMistake: (word: WordsMapItem) => Promise<void>;
}

const useCustomWordStore = create<CustomData>((set, get) => ({
    customCategories: [],
    customWordsMap: {
        data: [],
        total: 0,
        pages: 1,
        limit: 0,
        known: 0,
        unknown: 0,
    },
    addCustomData: async ({
        category, categoryName, subcategory, subcategoryName, emoji,
        words
    }) => {
        const res = await fetch('/api/customWordCategory/create', {
            method: 'POST',
            data: {
                category, categoryName, subcategory, subcategoryName, emoji,
                words
            },
        });
        if(res?.code === 200) {
            const { customCategories } = get();
            set({
                customCategories: [
                    ...(customCategories || []),
                    ...(res?.data ? [res?.data] : []),
                ],
            });
        }
    },
    deleteCustomData: async (subcategory: string) => {
        const res = await fetch('/api/customWordCategory/delete', {
            method: 'POST',
            data: {
                category: 'custom',
                subcategory,
            },
        });
        if (res?.code === 200) {
            const { customCategories } = get();
            const newList = customCategories?.filter?.((item) => item?.subcategory !== subcategory);
            set({
                customCategories: newList,
            });
        }
    },
    getCustomCategories: async () => {
        const { customCategories } = get();
        if (customCategories?.length > 0) return;
        const res = await fetch('/api/customWordCategory/get', {
            method: 'POST',
        });
        if (res?.code === 200) {
            set({
                customCategories: res?.data || [],
            });
        }
    },
    getCustomWords: async ({subcategory, page, limit, status}) => {
        const res = await fetch(`/api/customWords${status ? '/status' : ''}/get`, {
            method: 'POST',
            data: {
                category: 'custom',
                subcategory,
                page,
                limit,
                status: status || 'all',
            },
        });
        if (res?.code === 200) {
            const data = res?.data?.words?.map?.((item) => ({
                ...(item || {}),
                phonetic: '',
                audio: '',
                partOfSpeech: [],
                exampleAudio: '',
            })) || [];
            const { customWordsMap } = get();
            const known = status
                ? (status === WordStatus.KNOWN ? res?.data?.pagination?.total : customWordsMap?.known)
                : res?.data?.stats?.known;
            const unknown = status
                ? (status === WordStatus.UNKNOWN ? res?.data?.pagination?.total : customWordsMap?.unknown)
                : res?.data?.stats?.unknown;
            set({
                customWordsMap: {
                    data,
                    total: res?.data?.pagination?.total,
                    pages: res?.data?.pagination?.pages,
                    limit: res?.data?.pagination?.limit,
                    known: known,
                    unknown: unknown,
                },
            });
        }
    },
    updateCustomWordStatus: async ({category, subcategory, id, status}) => {
        const res = await fetch('/api/customWords/mark', {
            method: 'POST',
            data: {
                category,
                subcategory,
                id,
                status,
            },
        })
        if (res?.code === 200) {
            const { customWordsMap } = get();
            const data = customWordsMap?.data?.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        status,
                    }
                } else return item;
            });

            set({
                customWordsMap: {
                    ...customWordsMap,
                    data,
                },
            });
        }
    },
    addCustomMistake: async (word: WordsMapItem) => {
        const today = format(new Date(), "yyyy-MM-dd");
        const mistakes = [
            ...(word.mistakes || []),
            today,
        ];
        const res = await fetch('/api/customWords/mistakes/add', {
            method: 'POST',
            data: {
                category: word.category,
                subcategory: word.subcategory,
                id: word.id,
                mistakes,
            },
        });
        if (res?.code === 200) {
            const { customWordsMap } = get();
            const data = customWordsMap?.data?.map((item) => {
                if (item.id === word.id) {
                    return {
                        ...item,
                        mistakes,
                    }
                } else return item;
            })

            set({
                customWordsMap: {
                    ...customWordsMap,
                    data,
                },
            });
        }
    },
}));

export default useCustomWordStore;
