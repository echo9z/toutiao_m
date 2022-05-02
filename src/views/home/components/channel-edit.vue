<!--
* @description 编辑频道组件
* @fileName channel-edit.vue
* @author echo9z
* @date 2022/04/29 21:54:05
!-->
<template>
  <div class="channel-edit">

    <div class="warp-my-channel">
      <!-- 标题 加 按钮 -->
      <van-cell center :border="false">
        <template v-slot:title>
          <div class="channel-title">我的频道</div>
        </template>
        <!-- 编辑按钮 
          plain普通的
          round圆角-->
          <!-- 点击编辑按钮 我的频道中grid-item上出现关闭的小图标 -->
        <van-button 
          type="danger"
          plain
          round
          size="mini"
          @click="isEdit=!isEdit"
        >{{isEdit ? '完成':'编辑'}}</van-button>
      </van-cell>
      <!-- 格子间距 
        gutter：设置间距-->
      <van-grid :gutter="10" :border="false">
        <!-- 频道项 
          onUserChannel函数，当编辑状态为非编辑状态点击我的频道直接进入频道内容页面
            状态为编辑状态点击我的频道直接进入频道内容页面
            :icon="isEdit && index !== 0 ? 'close':''" 逻辑意思是排除第一推荐频道
        -->
        <van-grid-item 
          class="channel-item"
          :class="{'is-active':active === index}"
          v-for="(channel,index) in channels" 
          :key="index"
          :text="channel.name"
          :icon="isEdit && index !== 0 ? 'close':''" 
          @click="onUserChannel(channel,index)"
        >
          </van-grid-item>
      </van-grid>
    </div>

    <!-- 频道推荐 -->
    <div class="warp-recommend-channel">
      <!-- 标题 加 按钮 -->
      <van-cell center :border="false">
        <template v-slot:title>
          <div class="channel-title">频道推荐</div>
        </template>
      </van-cell>
      <!-- 格子间距 
        gutter：设置间距 -->
      <van-grid :gutter="10" :border="false">
        <van-grid-item 
          class="channel-item"
          v-for="(item,index) in getRecommend" 
          :key="index"
          :text="item.name"
          @click="onAddChannel(item,index)" />
      </van-grid>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex' 
import { getAllChannels,addUserChannels,delUserChannels } from '@/api/home.js'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',

  data () {
    return {
      allChannels:[], // 获取所有频道项
      isEdit:false, // 控制显示的编辑状态显示 默认close 小图标默认是隐藏的
    }
  },

  components: {},

  props: {
    channels:{
      type: Array,
      required: true
    },
    active:{
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapState(['user']),

    getRecommend(){
      // 所有频道 - 我的频道 就剩下 推荐的频道
      // filter函数：过滤数据，根据方法返回的布尔值 true来收集数据
      // return this.allChannels.filter(item => {
      //   // 当我的频道元素的id 与 全部频道的所有元素id相等时，说明存在findIndex反回当前我的元素的索引值，但值一定大于-1；
      //   // 反之，如果我的频道元素的id 与 全部频道的所有元素id 不相等时，findIndex反回-1 满足 filter过滤条件，最终剩下不相等元素的数组，即推荐的频道
      //   return this.channels.findIndex(myItem => { 
      //     return item.id === myItem.id
      //   }) === -1  // 通过过滤函数 遍历全部频道列表满足于元素中 与 我的频道列表元素 不相同的id元素，比如[1,2,3,4,5] 与 [2,4]; 1元素未在后面数组中出现返回-1，满足条件筛选出item
      // })
      const arr = [];
      for (let i = 0; i < this.allChannels.length; i++) {
        const item = this.allChannels[i];
        const flag = false
        for (let j = 0; j < this.channels.length; j++) {
          if(item.id === this.channels[j].id){
            flag = true
            break //结束当前j的循环
          }
        }
        if(!flag){
          arr.push(item)
        }
      }
      return arr
    }
  },

  created() {
    this.isLoadAllChannels()
  },

  //mounted: {},

  methods: {
    // 初始当前组件时，加载所有频道列表
    async isLoadAllChannels(){
      console.log(11);
      // 1.先过去所有的频道列表
      const {data:res} = await getAllChannels();
      console.log(res.data.channels);
      this.allChannels = res.data.channels;
      // 2.基于所有频道列表 通过过滤函数 与我的频道列表，进行筛选得到剩余的频道
      // 这部用计算属性完成
    },
    async onAddChannel(channel,index){
      this.channels.push(channel) // 这里不需要移除元素，原因是computed中让channels数据发生变化，会重新过滤
      // console.log(channel,index)
      // TODO:数据持久化
      // 频道数据持久化 两种情况：
      /**
       * 用户未登录
       * 数据存储本地，localStorage，因未登录不具备数据同步
       * 
       * 用户已登录
       * 登录也能使用，数据存储在线上服务器，更换不同的设备同时可以数据同步
       */
      if(this.user){
        // 登录了，存储在线上 
        // 用户将推荐频道 添加到 我的频道，即向服务端添加，有后端进行逻辑处理
        await addUserChannels({
          channels:[
            {
              id:channel.id,
              seq:this.channels.length // 这里的顺序序号是我的频道数组长度，为什么不是加1，原因是函数最开头添加了一项
            }
          ]
        })
        console.log('登录了');
      } else {
        console.log('本地');
        // console.log(this.channels);
        setItem('my-channel',this.channels)
      }

    },
    onUserChannel(channel,index){
      if(this.isEdit && index !== 0){
        // 编辑状态，删除频道
        this.deleteUserChannel(channel,index)
      }else {
        // 非编辑状态，切换频道
        this.switchChannel(index)
      }
      
    },
    async deleteUserChannel(channel,index){
      console.log('删除频道',index);
      // 如果删除当前频道之前的频道项
      if(index <= this.active){
         // 更新激活频道 this.active - 1
        this.$emit('activeUp',this.active - 1)
      }

      // 根据索引删除我的频道中数组对于index元素
      this.channels.splice(index,1)
      // TODO:数据持久化
      if(this.user){
        // 登录了 将数据持久化到线上
        await delUserChannels(channel.id)
      }else{
        // 没有登录
        setItem('my-channel',this.channels)
      }
    },
    switchChannel(index){
      console.log('切换频道');
      // 点击我的频道，关闭编辑频道按钮，同时切换进入当前点击频道内容页tab
      // 向父组件 home 传值
      this.$emit('enterChannel',index)
    }
  }
}

</script>
<style lang='less' scoped>
.channel-edit{
  padding-top: 54px;
  .channel-title{
    font-size: 16px;
    color:#333;
  }
  // 编辑按钮
  .van-button--plain.van-button--danger{
    width: 50px;
    font-size: 13px;
  }
  .is-active {
    /deep/.van-grid-item__text{  // 频道被选中时为红色
      color: red !important;
    }
  }
  .channel-item{
    width: 80px;
    height: 43px;
    /deep/.van-grid-item__content{
      border-radius: 10px;
      background-color: #f4f5f6;
      // font-size: 14px;
      color: #222;
      position: relative;
      .van-icon-close{
        position: absolute;
        right: -5px;
        top: -5px;
        font-size: 20px;
      }
      .van-grid-item__text{
        font-size: 13px;
        margin-top: 0;
      }
    }
  }
}
</style>