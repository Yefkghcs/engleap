import { create } from 'zustand';
import fetch from '@/utils/fetch';

export interface WordCategory {
    categoryList: Array<{
        category: string;
        categoryName: string;
        subcategories: Array<{
            id: string;
            name: string;
            total: number;
        }>;
    }>;
    getWordCategories: () => Promise<void>;
    getSubcategoryNameById: (id: string) => string;
}

const useWordCategoryStore = create<WordCategory>((set, get) => ({
    categoryList: [],
    getWordCategories: async () => {
        const { categoryList } = get();
        if (categoryList?.length > 0) return;

        const res = await fetch('/api/wordCategories/get');
        if (res.code === 200) {
            set({
                categoryList: res?.categoryList || [],
            });
        }
    },
    getSubcategoryNameById: (id: string) => {
        const { categoryList } = get();
        
        // 遍历所有分类和子分类，查找匹配的 id
        for (const category of categoryList) {
            const subcategory = category.subcategories.find(sub => sub.id === id);
            if (subcategory) {
                return subcategory.name;
            }
        }
        
        return '';
    },
}));

export default useWordCategoryStore;
