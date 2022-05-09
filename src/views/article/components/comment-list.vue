<!--
* @description 文章评论组件
* @fileName comment-list.vue
* @author echo9z
* @date 2022/05/07 09:53:08
!-->
<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item 
        v-for="(comment,index) in commentList" 
        :key="index" 
        :comment="comment" 
        @reply-click="replyClick($event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment.js'
import CommentItem from './comment-item.vue' // 每条评论项

export default {
  name: 'CommentList',

  data () {
    return {
      // commentList: [], // 评论列表数据  注释掉通过props 属性替代
      loading: false, // 上拉加载的状态，true处于加载时的状态，
      finished: false, // 当前结束状态为true时，不再触发onLoad加载事件
      offset: null, // 获取下一页的页码
      limit: 10, // 每页大小
      // postComment: {} // 存放post-comment传入的评论数据
    }
  },

  components: {
    CommentItem
  },

  props: {
    //如果获取文章评论，则传递文章id
    //如果获取评论回复，则传递p评论id
    source:{ // 源：如果传入的是文章id，侧获取的是文章评论列表数据； 如果传入的是用户评论的id，获取的是其他用户对该用的评论列表
      type: [String, Number, Object],
      required: true
    },
    // 获取文章评论，则传递a ，不传默认值为a
    // 获取评论回复，则传递c
    type:{
      type: String,
      default: 'a'
    },
    commentList:{
      type: Array,
      // 语法规范：数组或对象的默认值必须通过函数返回
      default: () => [],
      // default: function (){
      //   return []
      // }
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
    // 用户上拉加载用户评论
    async onLoad() {
      // 1请求获取数据
      const params = {
        type: this.type,//'a',	// 传a或c；a-获取文章(article)的评论，c-对评论(comment)的回复
        source: this.source.toString(),	// 源id，文章id或评论id，如果获取文章的评论传的文章id，如果要获取评论的回复传评论的id
        offset: this.offset,	//页面	获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据，传null即空
        limit: this.limit,	//每页的大小
      }
      const {data:res} = await getComments(params) // 根据传递参数，获取当前文章的评论；
      console.log(res);
      const comments = res.data.results

      this.$emit('totalComment',res.data.total_count)

      // 2将数据放到列表中
      this.commentList.push(...comments) 
      // 3将本次的loading关闭
      this.loading = false
      // 4判断是否有数据
      if(comments.length){ //如果长度为0，即没有评论。大于0有评论
         //    如果有，更新获取下一页的页码
        this.offset = res.data.last_id
      }else{
        //    如果没有，则将finished设置为true，不再触发加载更多了
        this.finished = true
      }
    },
    // 接收comment-item项
    replyClick(comment){
      this.$emit('onReply',comment) // 将commentItem项，继续往上抛出
    }
  }
}

</script>
<style lang='less' scoped>
</style>