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
      <!-- 汉堡按钮 template包裹中的 -->
      <template v-slot:nav-right>
        <!-- 点击显示弹出层 -->
        <div class="channel-more" @click="isChannelEditShow=true">
          <i class="toutiao toutiao-gengduo"></i>
        </div>
      </template>
      <!-- 每个tab标签 -->
      <van-tab v-for="channel in currentChannels" 
        :key="channel.id" :title="channel.name">
        <!-- 文章列表 -->
        <article-list :channel='channel' ></article-list>
      </van-tab>
    </van-tabs> 

    <!-- 点击汉堡 弹出频道编辑列表
      vant中弹出层组件
      position：从什么位置弹出，比如bottom从下往上
      closeable：显示关闭图标
      close-icon-position：关闭图标位置
      get-container="body"在body节点上渲染dom元素 -->
    <van-popup 
      v-model="isChannelEditShow" 
      round 
      position="bottom" 
      closeable
      close-icon-position="top-left"
      class="channel-edit-popup"
      get-container="body"
      style="height: 100%;"
    >
      <!-- 编辑频道列表 -->
      <channel-edit 
        v-on:enterChannel="enterChannelHandel($event)" 
        v-on:activeUp="active = $event" 
        :channels="currentChannels" 
        :active="active"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex' 
import {getUserChannels} from '@/api/home'
import {getItem} from '@/utils/storage'
import articleList from './components/article-list.vue'
import channelEdit from './components/channel-edit.vue'

export default {
  name: 'home',

  data () {
    return {
      active:0, //控制激活的 tab 页签的索引
      currentChannels:[], //频道的列表项
      isChannelEditShow: false, // 控制文章列表弹出层的显示与隐藏
    }
  },

  components: {
    'article-list':articleList,
    'channel-edit':channelEdit
  },

  props: {},

  computed: {
    ...mapState(['user'])
  },

  created() {
    //访问首页，加载头条列表数据
    this.loadChannels()
  },

  //mounted: {},

  methods: {
    //加载频道列表时，
    async loadChannels(){
      // if(!this.user && getItem('my-channel')){ //没有登录，将本地数据赋值给频道列表
      //   this.currentChannels = getItem('my-channel')
      // }else {
      //   //请求获取频道数据 (登录，通过线上获取)
      //   const {data:res} = await getUserChannels()
      //   console.log(res)
      //   this.currentChannels = res.data.channels
      // }
      let channels = [] // 临时存放 频道列表数据
      if(this.user){
        // 已登录，请求获取线上的用户频道列表数据
        const {data:res} = await getUserChannels()
        channels = res.data.channels
      } else {
        // 没有登录，是否有本地存储频道列表的三个月虎牙
        const loadChannel = getItem('my-channel')
        if(loadChannel){ // 有本地存储的频道列表则赋值
          channels = loadChannel
        }else{
          // 即没有登录，也没有存储的频道列表，那么就请求默认推荐频道列表
          const {data:res} = await getUserChannels()
          channels = res.data.channels
        }
      }
      //处理完毕赋值 当前使用频道列表
      this.currentChannels = channels
    },

    //逻辑：关闭编辑频道组件，切换频道，并进入频道，该函数由channel-edit子组件触发
    enterChannelHandel(index){
      this.isChannelEditShow = false
      console.log(index);
      this.active = index
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
  // 每个频道 即tab栏
  .channel-tabs{
    /deep/.van-tabs__nav{
      margin-right: 20px;
    }
    /deep/ .van-tabs__line{
      width: 20px;
      height: 3px;
      background-color: #3296fa;
    }
    // 汉堡 更多频道
    .channel-more{
      width: 30px;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.9);
      position: fixed;
      // top: 50px;
      right: 0px;
    }
  }
  // .channel-edit-popup{
  //   height: 85%;
  // }
}
</style>