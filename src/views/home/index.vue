<!--
* @description 首页组件
* @fileName index.vue
* @author echo9z
* @date 2022/04/25 14:46:38
!-->
<template>
  <div class="home-container">
    <!-- 导航栏部分，搜索功能 -->
    <van-nav-bar
      class="app-nav-bar">
      <template v-slot:title>
        <van-button icon-prefix="toutiao" 
          round 
          size="small" 
          block 
          icon="sousuo"
          class="search-btn">搜索</van-button>
      </template>
    </van-nav-bar>

    <!-- tab页签 不同频道 
    animated:点击页面进行切换，会有一个动画效果
    swipeable:左右滑动进行切换 -->
    <!-- vant中 标签页组件tans有一个功能，只有第一次访问标签页时候才会渲染里面的内容 -->
    <van-tabs class="channel-tabs" v-model="active" swipeable >
      <van-tab v-for="channel in currentChannels" 
        :key="channel.id" :title="channel.name">
        <!-- 文章列表 -->
        <article-list :channel='channel'></article-list>
      </van-tab>
    </van-tabs> 
  </div>
</template>

<script>
import {getUserChannels} from '@/api/home'
import articleList from './components/article-list.vue'

export default {
  name: 'home',

  data () {
    return {
      active:0, //控制激活的 tab 页签的索引
      currentChannels:[], //频道的列表项
    }
  },

  components: {
    'article-list':articleList
  },

  props: {},

  computed: {},

  created() {
    //访问首页，加载头条列表数据
    this.loadChannels()
  },

  //mounted: {},

  methods: {
    //加载频道列表
    async loadChannels(){
      //请求获取频道数据
      const {data:res} = await getUserChannels()
      console.log(res)
      this.currentChannels = res.data.channels
    }
  }
}

</script>
<style lang='less' scoped>
.home-container{
  /deep/.van-nav-bar__title{
    max-width: 100%;
    .search-btn{
      width: 277px;
      height: 32px;
      background-color: #5babfb ;
      border: none;
      color: #fff;
      .toutiao-sousuo{
        font-size: 1px;
      }
      .van-button__text{
        font-size: 14px;
      }
    }
  }

  .channel-tabs{
    /deep/ .van-tabs__line{
      width: 20px;
      height: 3px;
      background-color: #3296fa;
    }
  }
}
</style>