import { create } from 'zustand';
import { format } from "date-fns";
import fetch from '@/utils/fetch';

export enum WordStatus {
    UNMARKED = 'unmarked',
    UNKNOWN = 'unknown',
    KNOWN = 'known',
}

export interface WordsMapItem {
    id: number;
    category: string;
    subcategory: string;
    word: string;
    meaning: string;
    phonetic: string;
    audio: string;
    partOfSpeech: string[];
    example: string;
    exampleCn: string;
    exampleAudio: string;
    status: WordStatus;
    mistakes: string[];
}

export interface WordData {
    totalData: {
        mistake: number;
        learned: number;
    };
    wordsMap: {
        data: WordsMapItem[];
        total: number;
        pages: number;
        limit: number;
        known: number;
        unknown: number;
    };
    mistakesMap: {
        data: WordsMapItem[];
    };
    learnedMap: {
        data: WordsMapItem[];
    };
    getTotalData: () => Promise<void>;
    getWordData: ({page, limit, subcategory, status}: {
        page: number;
        limit: number;
        subcategory: string;
        status?: WordStatus;
    }) => Promise<void>;
    getLearnedWords: (statusList: WordStatus[]) => Promise<void>;
    updateWordStatus: ({category, subcategory, id, status}: {
        category: string, subcategory: string, id: number, status: WordStatus
    }) => Promise<void>;
    addMistake: (word: WordsMapItem) => Promise<void>;
    deleteMistake: (words: WordsMapItem[]) => Promise<void>;
    getWordDataByMistakes: (dates?: string[]) => Promise<void>;
}

const useWordStore = create<WordData>((set, get) => ({
    totalData: {
        mistake: 0,
        learned: 0,
    },
    wordsMap: {
        data: [],
        total: 0,
        pages: 1,
        limit: 0,
        known: 0,
        unknown: 0,
    },
    mistakesMap: {
        data: [],
    },
    learnedMap: {
        data: [],
    },
    getTotalData: async () => {
        const res = await fetch('/api/userWords/total/get', {
            method: 'POST',
        });
        if (res?.code === 200) {
            set({
                totalData: {
                    ...(res?.total || {}),
                },
            });
        }
    },
    getWordData: async ({page, limit, subcategory, status}) => {
        const res = await fetch(`/api/userWords${status ? '/status' : ''}/get`, {
            method: 'POST',
            data: {
                page,
                limit,
                subcategory,
                status: status || 'all',
            },
        });
        if (res.code === 200) {
            const { wordsMap } = get();
            set({
                wordsMap: {
                    data: [
                        ...(res.data?.words || [])
                    ],
                    total: res?.data?.pagination?.total,
                    pages: res?.data?.pagination?.pages,
                    limit: res?.data?.pagination?.limit,
                    known: status ? wordsMap?.known : res?.data?.stats?.known,
                    unknown: status ? wordsMap?.unknown : res?.data?.stats?.unknown,
                },
            });
        }
    },
    getLearnedWords: async (statusList: WordStatus[]) => {
        const res = await fetch('/api/userWords/status/all/get', {
            method: 'POST',
            data: {
                statusList
            }
        })
        if (res?.code === 200) {
            set({
                learnedMap: {
                    data: res?.data?.words || [],
                },
            });
        }
    },
    updateWordStatus: async ({category, subcategory, id, status}) => {
        const res = await fetch('/api/userWords/mark', {
            method: 'POST',
            data: {
                category,
                subcategory,
                id,
                status,
            },
        })
        if (res?.code === 200) {
            const { wordsMap } = get();
            const data = wordsMap?.data?.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        status,
                    }
                } else return item;
            });

            set({
                wordsMap: {
                    ...wordsMap,
                    data,
                },
            });
        }
    },
    addMistake: async (word: WordsMapItem) => {
        const today = format(new Date(), "yyyy-MM-dd");
        const mistakes = [
            ...(word.mistakes || []),
            today,
        ];
        const res = await fetch('/api/userWords/mistakes/add', {
            method: 'POST',
            data: {
                category: word.category,
                subcategory: word.subcategory,
                id: word.id,
                mistakes,
            },
        });
        if (res?.code === 200) {
            const { wordsMap } = get();
            const data = wordsMap?.data?.map((item) => {
                if (item.id === word.id) {
                    return {
                        ...item,
                        mistakes,
                    }
                } else return item;
            })

            set({
                wordsMap: {
                    ...wordsMap,
                    data,
                },
            });
        }
    },
    deleteMistake: async (words: WordsMapItem[]) => {
        const wordIds = words?.map?.((item) => ({
            category: item.category,
            subcategory: item.subcategory,
            id: item.id,
        }));
        const res = await fetch('/api/userWords/mistakes/delete', {
            method: 'POST',
            data: {
                words: wordIds,
            },
        });
        if (res?.code === 200) {
            const { mistakesMap } = get();
            const ids = words?.map?.((item) => item.id);
            const data = mistakesMap?.data?.filter?.((item) => !ids.includes(item?.id)) || [];
            set({
                mistakesMap: {
                    data,
                },
            });
        }
    },
    getWordDataByMistakes: async (dates?: string[]) => {
        const res = await fetch(dates 
            ? '/api/userWords/mistakes/date/get' 
            : '/api/userWords/mistakes/get', {
            method: 'POST',
            data: {
                page: 1,
                limit: 30,
                dates,
            },
        });
        if (res?.code === 200) {
            set({
                mistakesMap: {
                    data: res?.data?.words || [],
                },
            });
        }
    },
}));

export default useWordStore;
