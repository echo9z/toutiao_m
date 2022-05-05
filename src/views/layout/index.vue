<!--
* @description 导航展示页
* @fileName layout.vue
* @author echo9z
* @date 2022/04/25 14:35:29
!-->
<template>
  <div class="layout-container">
    <!-- 子路由出口，用于显示展示 -->
    <router-view></router-view>

    <!-- 底部标签导航 
      router:开启路由模式-->
    <van-tabbar v-model="active" router @change="onChange">
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/qa" icon="comment-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/my" icon="manager-o">我的</van-tabbar-item>
    </van-tabbar>

  </div>
</template>

<script>
export default {
  name: '',

  data () {
    return {
      active:0
    }
  },

  components: {},

  props: {},

  computed: {},

  created() {
    this.active = window.sessionStorage.getItem('active')
    console.log(this.active);
  },

  //mounted: {},

  methods: {
    //底部navbar 监听切换事件，保存激活的active值
    onChange(){
      console.log(this.active);
      window.sessionStorage.setItem('active',this.active)
    }
  }
}

</script>
<style lang='less' scoped>
</style>