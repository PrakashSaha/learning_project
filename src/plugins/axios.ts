import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'https://api.freeapi.app/api/v1'
})


axiosInstance.interceptors.request.use((config)=>{
    const token = JSON.parse(localStorage.getItem('currentAuthTokens') || '{}');
    if(token){
        config.headers = config.headers || {}; // set the haader//
        //we keeping the exsiting header or else it should be.
        //if we arent keep them like this it showed undefine.
        const unprotectedURLs = ['/users/login', '/users/register'];

        if(config.url && !unprotectedURLs.includes(config.url)){

            config.headers.Authorization = token ? `Bearer ${token.accessToken}` : ''
        }
    }
    return config 
})
export default axiosInstance;