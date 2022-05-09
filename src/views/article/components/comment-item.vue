<!--
* @description 每条的评论项
* @fileName comment-item.vue
* @author echo9z
* @date 2022/05/07 14:05:56
!-->
<template>
  <div class="comment-item">
    <van-cell >
      <!-- 头像 -->
      <van-image
        class="avatar"
        round
        fit="cover"
        slot="icon"
        :src="comment.aut_photo"
      />
      <div slot="title">
        <div class="name-like-warp">
          <!-- 评论人名 与 点赞时同一行-->
          <div class="name">
            {{comment.aut_name}}
            <!-- <span v-show="user" >我</span> -->
          </div>

          <!-- 点赞 http://localhost:8080/#/article/8126
            @click="onCommentLike" 评论点赞 点击事件 -->
          <div class="like-warp" @click="onCommentLike">
            <van-icon 
              class="like"
              :color="comment.is_liking ? 'red':'' "
              :name="comment.is_liking ? 'good-job':'good-job-o'"
              />
            <span
              class="like-count"
            >{{comment.like_count}}</span>
          </div>
        </div>
        <!-- 评论内容 -->
        <div class="content">{{comment.content}}</div>
        <!-- 评论时间 -->
        <div class="pubdate-replybtn-warp">
          <span class="pubdate">{{comment.pubdate | dataTime('MM-DD HH:mm')}}</span>
          <!-- 回复按钮 -->
          <van-button
            class="reply-btn"
            round 
            size='mini'
            @click="isReplyClick"
          >{{comment.reply_count}} 回复</van-button>
        </div>
      </div>
      
    </van-cell>
  </div>
</template>

<script>
// import {mapState} from 'vuex'
import {addCommentLike,delCommentLike} from '@/api/comment'

export default {
  name: 'CommentItem',

  data () {
    return {
    }
  },

  components: {},

  props: {
    comment:{
      type: Object,
      required: true
    }
  },

  computed: {
    // ...mapState(['user'])
  },

  created() {},

  //mounted: {},

  watch: {},

  methods: {
    async onCommentLike(){ // 图标的点赞
      if(this.comment.is_liking){ // 根据 is_liking值，判断是否对该用的评论点赞
        // 点赞了，取消 点赞
        await delCommentLike(this.comment.com_id.toString())
        this.comment.like_count -= 1
      }else{
        // 没有点赞，添加点赞
        await addCommentLike(this.comment.com_id.toString())
        this.comment.like_count += 1
      }
      // 将is_liking修改状态，取反
      this.comment.is_liking = !this.comment.is_liking
    },
    // 点击回复按钮，将当前评论的item 向 comment-list抛出
    isReplyClick(){
      console.log(1);
      this.$emit('reply-click',this.comment)
    }
  }
}

</script>
<style lang='less' scoped>
.comment-item{
  .avatar{  // 评论头像
    width: 40px;
    height: 40px;
    margin: 5px 16px 0 5px;
  }
  .name-like-warp{
    display: flex;
    justify-content: space-between;
    .name{ // 评论名称
      font-size: 13px;
      color: #406599;
    }
    .like-warp{ // 点赞
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }
  }
  .content{ // 评论内容
    font-size: 15px;
    color: #222;
    margin: 5px 0;
  }
  .pubdate-replybtn-warp{
    display: flex;
    .pubdate{ // 评论时间
      font-size: 10px;
      margin-right: 10px;
    }
  }
  // 评论点赞
  .van-cell__value{
    flex: unset;
    
  }
}
</style>