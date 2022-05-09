<!--
* @description 回复用户评论组件
* @fileName comment-reply.vue
* @author echo9z
* @date 2022/05/08 23:54:30
!-->
<template>
  <div class="comment-reply">
    <!-- 评论的回复数 -->
    <van-nav-bar :title="`${replyComment.reply_count}条回复`" >
      <van-icon 
        slot="right" 
        name="close" 
        size="18"
        @click="$emit('closeReplyPopup')" />
    </van-nav-bar>
    <!-- /评论的回复数 -->
    <!-- 当前评论项 -->
    <comment-item
      :comment="replyComment"
    ></comment-item>

    <!-- 当前评论的 所有回复回复项 -->
    <!-- <van-cell title="所有回复"></van-cell> -->
    <!-- 传入的两个属性参数
      source：当前评论id
      type：c 表示回复 -->
    <comment-list 
      :source="replyComment.com_id"
      :commentList="commentList"
      :type="'c'"
      @onReply="onReplyClick"
    />

    <!-- 点击评论按钮 -->
    <div class="reply-comment-btn">
      <!-- 评论按钮 -->
      <van-button
        class="reply-btn"
        type="default"
        round
        size='small'
        @click="isReplyShow = true"
      >写评论</van-button>
    </div>

    <!-- 发布回复弹出层 -->
    <van-popup 
      v-model="isReplyShow" 
      position="bottom" 
      close-icon-position="top-left"
      class="post-popup"
      get-container="body"
      round
    >
    <!-- 发布评论组件 -->
      <post-comment
        :target="replyComment.com_id"
        :articleId="articleId"
        @post-success='onPostSuccess'
      />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import PostComment from './post-comment.vue'

export default {
  name: 'CommentReply',

  data () {
    return {
      commentList:[], //存放当前回复评论列表
      isReplyShow: false // 用于控制 发布回复的显示与隐藏
    }
  },

  components: {
    CommentItem,
    CommentList,
    PostComment
  },

  props: {
    // 查看的评论项，由父组件提供，里面包含评论的id
    replyComment:{
      type: Object,
      required: true
    },
    articleId:{
      type: [String, Number, Object],
      required: true
    }
  },

  computed: {},

  created() {},

  // mounted(){
  //   console.log(1);
  //   // 通过on创建一个addComment监听事件，监听 post-comment组件传入的值，即后端响应的数据
  //   this.$bus.$on('addComment',(val) => {
  //     console.log(val);
  //     // 将后台返回的数据，添加到commentList评论列表中
  //     this.commentList.unshift(val)
  //     // this.postComment = val
  //   })
  // },

  // beforeDestroy(){
  //   // 销毁事件addComment的监听
  //   this.$bus.$off('addComment')
  // },
  watch: {},

  methods: {
    // 将post-comment组件中返回回复评论 添加 评论列表中
    onPostSuccess(replay){
      // 将发布成功的评论放到列表的评论项中
      this.commentList.unshift(replay)
      // 更新评论回复数
      this.replyComment.reply_count++
      this.isReplyShow = false
    },
    onReplyClick(comment){
      this.isReplyShow = true
      console.log(comment);
    }
  }
}

</script>
<style lang='less' scoped>
.reply-comment-btn{ // 底部位置
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    .reply-btn { // 写评论按钮
      width: 200px;
      height: 30px;
      border: 2px solid #eeeeee;
      font-size: 14px;
      line-height: 23px;
      color: #a7a7a7;
    }
  }
</style>