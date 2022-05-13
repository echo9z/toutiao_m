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
      { // 问答
        path: '/qa', 
        name: 'qa',
        component: () => import('@/views/qa/'),
      },
      { // 视频
        path: '/video', 
        name: 'video',
        component: () => import('@/views/video/'),
      },
      { // 我的
        path: '/my', 
        name: 'mine',
        component: () => import('@/views/mine/'), // 我的路由
      },
    ]
  },
  { // 搜索
    path:'/search',
    name:'search',
    //路由懒加载
    component: ()=> import('@/views/search/') //登录加注册路由
  },
  { // 文章
    path:'/article/:articleId',
    name:'article',
    //路由懒加载
    component: ()=> import('@/views/article/'), //登录加注册路由
    props: true  // 将动态路由传参 映射到组件的 props中，无论是访问和维护方便
  },
  { // 用户编辑
    path:'/user/profile',
    name:'user-profile',
    //路由懒加载
    component: ()=> import('@/views/user-profile/') //登录加注册路由
  },
  { // 机器人聊天
    path:'/user/chat',
    name:'user-chat',
    //路由懒加载
    component: ()=> import('@/views/user-chat/') //登录加注册路由
  },
]

const router = new VueRouter({
  routes  
})

export default router
