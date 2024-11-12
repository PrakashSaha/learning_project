import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { APIResponse, User } from '@/type/index'
import {getLocalStorageData} from '@/lib/utils'
export const useAuthStore = defineStore('Aathstore', {
    state: () => ({
        user: getLocalStorageData<User | null>('currentUserContent', true)
    }),

    actions: {
        async registerUser(form: Record<string, string>) {
            return new Promise<User>(async (res, rej) => {
                try {
                    console.log('Sending form data:', form);
                    const { data } = await axios.post<APIResponse< {user : User} >>('/users/register', {
                        ...form
                    });
                    console.log('REGISTER RESPONSE:', data.data);
                    res(data.data.user);
                } catch (e) {
                    rej(e);
                }
            });
        },

        async loginUser(form: Record<string, string>) {
            return new Promise<User>(async (res, rej) => {
                try {
                    console.log('Sending form data:', form);
                    const { data } = 
                    await axios.post<APIResponse< 
                    {user : User, accessToken:String, refreshToken:String} 
                    >>('/users/login', {
                        ...form
                    });
                    this.user = data.data.user
                    console.log('Login request sucess');
                    // console.log('LOGIN RESPONSE:', data.data);
                    localStorage.setItem("currentUserContent", JSON.stringify(data.data.user));
                    localStorage.setItem("currentAuthTokens", JSON.stringify({
                        accessToken: data.data.accessToken,
                        refreshToken: data.data.refreshToken,
                    }));


                    res(data.data.user);
                } catch (e) {
                    console.error('Login request failed:', e.response?.data || e.message);
                    rej(e);
                }
            });
        },
        
    },
})
