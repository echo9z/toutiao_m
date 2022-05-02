import Vue from 'vue'
import { Button,Icon,Tabbar,TabbarItem,NavBar,Cell,CellGroup,Form,Field, 
  Toast,CountDown,Image as VanImage,Grid, GridItem,Dialog,Tab,Tabs,List,
  PullRefresh,Popup  } from 'vant'

Vue.use(Button)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(NavBar)
Vue.use(Field)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Form)
Vue.use(CountDown)
Vue.use(VanImage)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(Popup)
// Vue.use(Toast)
Vue.prototype.$message = Toast
Vue.prototype.$dialog = Dialog
