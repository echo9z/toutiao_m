import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载全局样式
import './style/index.less'

Vue.config.productionTip = false // 关闭生产环境

// 创建vue 根实例，将router store配置到根实例中
// 通过render函数将 将app组件 渲染到 #app节点上
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
