import Vue from 'vue'
import { Button,Icon,Tabbar,TabbarItem,NavBar,CellGroup,Form,Field, 
  Toast,CountDown } from 'vant'

Vue.use(Button)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(NavBar)
Vue.use(Field)
Vue.use(CellGroup)
Vue.use(Form)
Vue.use(CountDown)
// Vue.use(Toast)
Vue.prototype.$message = Toast
