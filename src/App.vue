<template>
  <div id="app">
    <!-- 路由出口，路由匹配到的页面，会渲染到view -->
    <!-- keep-alive 通过vue中 keep-alive 将下面路由组件进行包裹缓存，不会因为点击进入其他组件，从而导致其他组件被销毁；
        但是有个问题，组件被缓存了，单组件中的声明周期函数不在执行了，比如像created()-->
    <!-- router-view是一级出口，keep-alive 仅对该路由出口渲染的组件有效 
        添加上:include="['LayoutIndex']，只缓存LayoutIndex下的组件
        这里需要动态的处理 登录问题，第一次用户登录了，mine组件属于LayoutIndex组件下路由出口，配置了keep alive，缓存了mine组件；
        第二次用户退出，重新登录，由于配置了keep alive缓存，不会执行相关mine中的生命周期函数，所以第二次登录的数据不会被渲染到mine组件中，使用的第一次加载用户所留下的用户数据
        所以，这里需要做一个动态处理，就是在用户第二登录时候，将layout缓存的组件数据清楚掉，清除掉layout组件缓存，mine组件中的生命周期函数才会执行-->
    <keep-alive :include="cachePages">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'App',
  computed:{
    ...mapState(['cachePages'])  // 添加要存放的缓存组件
  }
}
</script>

<style lang="less">
</style>
