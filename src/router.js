import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'
import User from '@/views/users/User.vue'

// 一定要记得use
Vue.use(VueRouter)

// 这个default将来这个文件被引入的时候会默认返回
export default new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      //   添加重定向
      redirect: { name: 'Login' }
    },

    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/home',
      component: Home,
      // 为welcome页面做请求重定向
      redirect: { name: 'Welcome' },
      // 因为要将Welcome里面的内容展示到Home中的某一组建
      // 所以要用嵌套路由做
      children: [
        {
          name: 'Welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'User',
          path: 'user',
          component: User
        }
      ]
    }
  ]
})
