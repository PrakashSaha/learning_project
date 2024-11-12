import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { APIResponse, Product, Products } from '@/type/index'
import{handleSucess, handleError} from '@/lib/utils'
export const useProductStore = defineStore('ProductStore', {
    state: () => ({

        productsData: {} as Products
    }),

    actions: {
        async createProduct(form: Record<string, any>) {
            return new Promise<Product>(async (res, rej) => {
                  try {

                    const formData = new FormData();
                    formData.append('name', form.name);
                    formData.append('price', form.price);
                    formData.append('stock', form.stock);
                    formData.append('mainImage', form.mainImage);
                    formData.append('description', form.description);
                    formData.append('category', form.category);
                    for (let i = 0; i < form.subImages.length; i++) {
                        formData.append('subImages', form.subImages[i]);
                    }
                    const { data } = await axios.post<APIResponse<Products>>('/ecommerce/products', formData);
                    console.log('products', data.data);
                    res(data.data);
                    handleSucess(data.statusCode.toString(), data.message);
                } catch (error) {
                    handleError(error);
                    rej(error)
                }
            });
        },

        async getProducts(page: number, limit: number) {
            return new Promise<Products>(async (res, rej) => {
                try {
                    const { data } = await axios.get<APIResponse<Products>>
                    (`/ecommerce/products?page=${page}&limit=${limit}`);
                    console.log('PRODUCT RESPONSE:', data.data);
                    this.productsData = data.data
                    res(data.data);
                } catch (e) {
                    rej(e);
                }
            });
        },

        async deleteProducts(productId: string) {
            return new Promise(async (res, rej) => {
                try {
                    const { data } = await axios.delete(`/ecommerce/products/${productId}`);
                    console.log('PRODUCT RESPONSE:', data.data);
                    //this.productsData.products = this.productsData.Products.filter(p=> p._id !==productsId);
                    await this.getProducts(1,2)
                    res(data.data);
                } catch (e) {
                    rej(e);
                }
            });
        },
        async getProduct(productId: string) {
            return new Promise<Product>(async (res, rej) => {
                try {
                    const { data } = await axios.get<APIResponse<Product>>
                    (`/ecommerce/products/${productId}`);
                    console.log('PRODUCT RESPONSE:', data.data);
                    res(data.data);
                } catch (e) {
                    rej(e);
                }
            });

        },async editProduct(productId: string, form: Record<string, any>) {
            return new Promise<Product>(async (res, rej) => {
                try {
                    const formData = new FormData();
                    formData.append('name', form.name);
                    formData.append('price', form.price);
                    formData.append('stock', form.stock);

                    if(form.mainImage){

                        formData.append('mainImage', form.mainImage);
                    }
                    if(form.mainImage){

                        for (let i = 0; i < form.subImages.length; i++) {
                            formData.append('subImages', form.subImages[i]);
                        }
                    }
                    formData.append('description', form.description);
                    formData.append('category', form.category);
                    
                    const { data } = await axios.patch<APIResponse<Product>>
                    (`/ecommerce/products/${productId}`, formData);
                    console.log('PRODUCT RESPONSE:', data.data);
                    await this.getProducts(1,2)
                    res(data.data);
                    handleSucess(data.statusCode.toString(), data.message);
                } catch (e) {
                    handleError(e);
                    rej(e);
                }
            });
        },

    },
});
