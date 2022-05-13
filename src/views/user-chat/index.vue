<!--
* @description 机器人聊天
* @fileName index.vue
* @author echo9z
* @date 2022/05/11 19:48:37
!-->
<template>
  <div class="user-chat">
    <!-- 导航栏 -->
    <div ref="navRef">
      <van-nav-bar
        class="app-nav-bar"
        title="echo同学"
        left-arrow 
        @click-left="$router.back()" /> 
    </div>

    <!-- 消息列表 -->
    <van-cell-group class="msg-list" ref="listRef" >
      <div class="chat-list" ref="list">
        <div class="chat-item" v-for="(item,index) in messageList" :key="index">
          <div
            v-if="item.name === 'bot'"
            class="chat-item-left">
            <van-image
              class="chat-avatar"
              round
              src="https://img01.yzcdn.cn/vant/cat.jpeg"/>
              <div class="chat-message">{{item.msg}}</div>
          </div>
          <div v-else
            class="chat-item-right">
            <div class="chat-message">{{item.msg}}</div>
            <van-image
              class="chat-avatar"
              round
              :src="myAvatar"/>
          </div>
          <!-- <geek-icon v-if="item.name==='xz'" name="bot" />
          <div class="chat-pao">{{item.msg}}</div>
          <van-image v-if="item.name==='my'" fit="cover" round :src="myAvatar" /> -->
        </div>
      </div>
      
    </van-cell-group>

    <!-- 发送消息 -->
    <van-cell-group class="send-msg">
      <van-field v-model="msg" rows="1" autosize placeholder="请输入消息" >
        <van-button slot="button" size="small" type="primary" @click.enter="sendMessage">发送</van-button>
      </van-field>
    </van-cell-group>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user.js'
import { setItem,getItem,removeItem } from '@/utils/storage.js'
import { createdSocket } from '@/utils/socketio.js'


export default {
  name: 'UserChat',

  data () {
    return {
      msg:'',
      socket: null, // socket连接对象
      messageList: getItem('chat-msg') || [], //加载本地消息列表，没有默认空数组
      myAvatar:'' // 存放头像url
    }
  },

  components: {},

  props: {},

  computed: {},

  async created() {
    const {data:res} = await getUserProfile()
    this.myAvatar = res.data.photo

    const socket = await createdSocket()
    this.socket = socket
    
    socket.on('connect', () => {
      this.messageList.push({ name: 'bot', msg: '我是echo同学，需要什么帮助吗？' })
    });
    
    socket.on('disconnect', () => { // 
      console.log('连接已关闭');
    }) 

    // 接收消息
    socket.on('message',(data) => { //该receiveMsg自定义事件必须对应服务端事件
      //将机器人回复消息 push数组中
      this.messageList.push({ name: 'bot', msg: data.msg })
    })
  },

  //mounted() {},

  watch: {
    messageList(){ // 将聊天记录 持久化到本地数据
      setItem('chat-msg',this.messageList)
      // 将每次用户发送的 消息 滚动到底部

      // 数据改变 影响视图更新这件事不是立即的
      // 如果你在操作数据之后立即操作数据影响的视图DOM，那么最后把代码放到nextTick函数
      this.$nextTick(() => {
        this.scrollToBottom()
      })
      
    }
  },

  methods: {
    // 发送消息
    sendMessage(){
      console.log(1);
      this.socket.emit('message',{
        msg: this.msg, 
        timestamp: Date.now()
      })
      // 用户发送的消息push数组中
      this.messageList.push({ name: 'my', msg: this.msg })
      this.msg = '' // 清空输入框
    },
    // 将发送消息框滚动到最底部
    scrollToBottom(){
      const list = this.$refs.listRef;
      list.scrollTop = list.scrollHeight + this.$refs.navRef.scrollHeight
    }
  }
}

</script>
<style lang='less' scoped>
.user-chat{
  .msg-list{
    position: fixed;
    top: 46px;
    bottom: 53px;
    left: 0;
    right: 0;
    overflow-y: auto;
    .chat-item-left{ // 
      display: flex;
      padding: 15px 10px;
      justify-content: flex-start;
      align-items:center;
      .chat-avatar{
        height: 45px;
        width: 45px;
      }
      .chat-message{
        max-width: 260px;
        font-size: 14px;
        background-color: rgb(161, 210, 229);
        margin-left: 10px;
        padding: 5px 10px;
        border-radius: 14px;
      }
    }
    .chat-item-right{ // 
      display: flex;
      padding: 15px 10px;
      justify-content: flex-end;
      align-items:center;
      .chat-avatar{
        height: 45px;
        width: 45px;
      }
      .chat-message{
        max-width: 260px;
        font-size: 14px;
        background-color: rgb(161, 210, 229);
        margin-right: 10px;
        padding: 5px 10px;
        border-radius: 14px;
      }
    }

  }
  .send-msg{
    display: flex;
    align-items: center;
    position: fixed;
    padding: 0 14px;
    bottom: 0;
    left: 0;
    right: 0;
    .van-button--small { // 调整按钮大小
      padding: 0 23px;
    }
    /deep/.van-field__control{
      padding: 0 14px;
    }
  }
}
</style>