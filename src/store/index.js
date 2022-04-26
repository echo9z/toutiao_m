import Vue from 'vue'
import Vuex from 'vuex'
import {getItem,setItem} from '@/utils/storage'

// 用户本地存储的常量名称
const USER_KEY = 'toutiao-user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // user: JSON.parse(window.localStorage.getItem('user')) || null//存放当前用户登录的登录状态（token等信息）
    user: getItem(USER_KEY)//存放当前用户登录的登录状态（token等信息）
  },
  getters: {
  },
  mutations: {
    setUser(state,data){
      state.user = data //将后端数据存放user中
      //为了防止页面刷新数据丢失，需要把数据存放到本地存储，仅仅是为了数据持久化
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
