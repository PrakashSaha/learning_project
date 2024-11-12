import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { APIResponse, Category, Categories } from '@/type/index'
import Category from '@/views/Category.vue';

export const useCategoryStore = defineStore('CategoryStore', {
    state: () => ({

        categoriesData: {} as Categories
    }),

    actions: {
        async createCategory(form: Record<string, string>) {
            return new Promise<Category>(async (res, rej) => {
                try {
                    console.log('Sending form data:', form);
                    const { data } = await axios.post<APIResponse<Category>>('/ecommerce/categories', {
                        ...form
                    });
                    console.log('CATEGORY RESPONSE:', data.data);
                    res(data.data);
                } catch (e) {
                    rej(e);
                }
            });
        },
        
        async getCategory(page: number, limit: number) {
            return new Promise<Categories>(async (res, rej) => {
                try {
                    const { data } = await axios.get<APIResponse<Categories>>
                    (`/ecommerce/categories?page=${page}&limit=${limit}`);
                    console.log('CATEGORY RESPONSE:', data.data);
                    this.categoriesData = data.data
                    res(data.data);
                } catch (e) {
                    rej(e);
                }
            });
        },


    },
});
