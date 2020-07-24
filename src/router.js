import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
import axios from 'axios'
Vue.use(Router)

function guardMyroute(to, from, next)
{
   if(sessionStorage.getItem('LoggedUserYukPickup_email') && sessionStorage.getItem('LoggedUserYukPickup_token')) {
    var email = sessionStorage.getItem('LoggedUserYukPickup_email')
     var token = sessionStorage.getItem('LoggedUserYukPickup_token')
    //  var name = sessionStorage.getItem('LoggedUserYukPickup_name')

    //  Cek sesi aktif ke server
    axios.get('https://api.bikermart.co.id/v1/user/sessionChecker?key=Bikermart%232020&email='+ encodeURIComponent(email) +'&token=' + encodeURIComponent(token)).then((res) => {
      console.log(res);
      if(res.data.data.status == 'user_ditemukan' && email == res.data.data.email) {
        next();
      } else {
        next('/login');
      }
    }).catch((err) => {
      console.error(err);
    })

   } else {
    next('/login');
   }

}

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: 'dashboard',
      component: DashboardLayout,
      beforeEnter: guardMyroute,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('./views/Dashboard.vue')
        },
        {
          path: '/product',
          name: 'Product',
          component: () => import('./views/produk/Tables.vue')
        },

        {
          path: '/order/masuk',
          name: "Order Masuk",
          component: () => import('./views/orderMasuk/index.vue')
        }
      ]
    },
    {
      path: '/',
      redirect: 'login',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import(/* webpackChunkName: "demo" */ './views/Login.vue')
        },
        {
          path: '/register',
          name: 'register',
          component: () => import(/* webpackChunkName: "demo" */ './views/Register.vue')
        }
      ]
    },

    // Catch 404 error redirect to dashboard
    {
      path: '*',
      redirect: '/'
    }
  ]
})
