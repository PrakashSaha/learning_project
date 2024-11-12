import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Category from '../views/Category.vue'
import SingleProduct from '../views/products/[id].vue'
import {isUserLoggedIn} from '@/lib/utils'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        auth: true
      }
    },{
      path: '/category',
      name: 'category',
      component: Category,
      meta: {
        auth: true
      }
    },{
      path: '/products/:id',
      name: 'single-product',
      component: SingleProduct,
      meta: {
        auth: true
      }
    },{
      path: '/auth/login',
      name: 'auth-login',
      component: Login,
      
    },{
      path: '/auth/register',
      name: 'auth-register',
      component: Register,
    },
  ],
})

router.beforeEach(async(to, form, next)=>{

  const isLoggedin = await isUserLoggedIn();
  // const isLoggedin = true;

  if(to.name !== 'auth-login' && !isLoggedin){
     if(!to.meta.auth){
      return next();
     }
     return next ({name: 'auth-login'});
  }else if(to.name === 'auth-login' && isLoggedin){
    return next ({name: 'home'});
    
  }else{
    next();
  }

})
export default router
