<template>
  <div id="app">
    <!-- 路由出口，路由匹配到的页面，会渲染到view -->
    <!-- keep-alive 通过vue中 keep-alive 将下面路由组件进行包裹缓存，不会因为点击进入其他组件，从而导致其他组件被销毁；
        但是有个问题，组件被缓存了，单组件中的声明周期函数不在执行了，比如像created()-->
    <!-- router-view是一级出口，keep-alive 仅对该路由出口渲染的组件有效 -->
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
</style>
