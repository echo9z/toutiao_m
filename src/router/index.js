import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path:'/login',
    name:'login',
    //路由懒加载
    component: ()=> import('@/views/login/') //登录加注册路由
  },
  {
    path:'/',
    component: () => import('@/views/layout/'), //先渲染layout组件
    children: [
      {
        path: '', //默认子路由, 以访问 / 会默认重定向到home组件
        name: 'home',
        component: () => import('@/views/home/'), // 首页路由
      },
      {
        path: '/qa', 
        name: 'qa',
        component: () => import('@/views/qa/'),
      },
      {
        path: '/video', 
        name: 'video',
        component: () => import('@/views/video/'),
      },
      {
        path: '/my', 
        name: 'mine',
        component: () => import('@/views/mine/'), // 我的路由
      },
    ]
  },
  {
    path:'/search',
    name:'search',
    //路由懒加载
    component: ()=> import('@/views/search/') //登录加注册路由
  }
]

const router = new VueRouter({
  routes  
})

export default router
