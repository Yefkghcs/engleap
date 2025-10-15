import { create } from 'zustand';
import { format } from "date-fns";
import fetch from '@/utils/fetch';

let once = false;

export interface UserInfo {
    email: string;
    getUserInfo: () => Promise<void>;
    updateUser: (email: string) => void;
    clearUser: () => void;

    checkStatus: string[];
    getCheckStatus: () => Promise<void>;
    addCheckStatus: () => Promise<void>;
}

const useUserInfo = create<UserInfo>((set, get) => ({
    email: '',
    getUserInfo: async () => {
        const { email } = get();
        if (email || once) return;
        const res = await fetch('/api/user/current');
        once = true;
        if (res.code === 200) {
            set({
                email: res.user?.email ?? '',
            });
        }
    },
    updateUser: (email) => {
        set({
            email: email || '',
        });
    },
    clearUser: () => {
        set({
            email: '',
        });
    },

    checkStatus: [],
    getCheckStatus: async () => {
        const res = await fetch('/api/user/check/get', {
            method: 'POST',
        });
        if (res?.code === 200) {
            set({
                checkStatus: res?.data || [],
            });
        }
    },
    addCheckStatus: async () => {
        const today = format(new Date(), "yyyy-MM-dd");
        const { checkStatus } = get();
        if (checkStatus.includes(today)) return;
        const res = await fetch('/api/user/check/add', {
            method: 'POST',
            data: {
                date: today,
            },
        });
        if (res?.code === 200) {
            set({
                checkStatus: res?.data || [],
            });
        }
    },
}));

export default useUserInfo;
