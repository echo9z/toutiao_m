import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store';
import { Dialog } from 'vant';

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path:'/login',
    name:'login',
    //路由懒加载
    component: ()=> import('@/views/login/'), //登录加注册路由
    meta: { requiresAuth: false } // 配置一个属性requiresAuth为false，通过路由守卫根据属性进行相应的逻辑处理
  },
  {
    path:'/',
    component: () => import('@/views/layout/'), //先渲染layout组件
    children: [
      {
        path: '', //默认子路由, 以访问 / 会默认重定向到home组件
        name: 'home',
        component: () => import('@/views/home/'), // 首页路由
        meta: { requiresAuth: false } // mate 添加一个路由元信息，相当于配置flag
      },
      { // 问答
        path: '/qa', 
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: { requiresAuth: false }
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
        meta: { requiresAuth: false }
      },
    ]
  },
  { // 搜索
    path:'/search',
    name:'search',
    //路由懒加载
    component: ()=> import('@/views/search/'), //登录加注册路由
    meta: { requiresAuth: false }
  },
  { // 文章
    path:'/article/:articleId',
    name:'article',
    //路由懒加载
    component: ()=> import('@/views/article/'), //登录加注册路由
    props: true,  // 将动态路由传参 映射到组件的 props中，无论是访问和维护方便
    meta: { requiresAuth: false }
  },
  { // 用户编辑
    path:'/user/profile',
    name:'user-profile',
    //路由懒加载
    component: ()=> import('@/views/user-profile/'), //登录加注册路由
    meta: { requiresAuth: false }
  },
  { // 机器人聊天
    path:'/user/chat',
    name:'user-chat',
    //路由懒加载
    component: ()=> import('@/views/user-chat/'), //登录加注册路由
    meta: { requiresAuth: true }
  },
]

const router = new VueRouter({
  routes  
})

// 路由导航，全局前置守卫，理解拦截器
/**
 * to：要访问的页面路由信息
 * form：来自那个页面的路由信息
 * next：直接放行，允许访问
 */
router.beforeEach((to, from, next) => {
  // ...
  const requiresAuth = to.meta.requiresAuth
  if(requiresAuth && !store.state.user){
    // if(store.state.user){ // 校验是否用户已登录，直接放行，跳转至要去页面
    //   return next()
    // }
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，需要确认登录吗？',
    }).then(() => {
      // on confirm 确认
      return router.replace({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }).catch(() => {
      // on cancel 取消，停止路由导航，next(false) 不跳转至新的页面
      next(false)
    })
  }else{  //meta.requiresAuth 为false直接访问响应路由url
    next()
  }
})


export default router
