import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载 Vant UI 组件
import './plugins/vant.js'
// 加载 flexible 自动设置 rem 基准值 (html标签字体大小)，根据分辨率大小设置html字体标签大小
import 'amfe-flexible'
// 加载 postcss-pxtorem 将 px单位转换为 rem
import 'postcss-pxtorem'

// //加载 axios请求模块
// import request from '@/utils/request'
// Vue.prototype.$http = request; //将axios 挂在到Vue类的原型对象上

// 加载全局样式
import './style/index.less'

import './utils/dayjs'

Vue.config.productionTip = false // 关闭生产环境

// 创建vue 根实例，将router store配置到根实例中
// 通过render函数将 将app组件 渲染到 #app节点上
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
