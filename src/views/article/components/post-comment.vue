<!--
* @description 评论发布功能组件
* @fileName post-comment.vue
* @author echo9z
* @date 2022/05/07 17:51:29
!-->
<template>
  <div class="post-comment">
    <!-- 设置 maxlength 与 show-word-limit属性后会在底部显示字数统计 
    rows：默认有几个输入行
    autosize：高度自适应，当输入的文字内容越多，会自动提升输入框高度
    v-model.trim能自动取出内容中空格-->
    <van-field
        v-model.trim="comment"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
        show-word-limit
      />
    <van-button
      size="small"
      class="post-btn"
      @click="onPost"
      :disabled="!comment"
    >发布</van-button>
  </div>
</template>

<script>
import {addComment} from '@/api/comment';

export default {
  name: 'PostComment',

  data () {
    return {
      comment: '', // 输入框内容
    }
  },

  components: {},

  props: {
    // 1-如果是对文章进行评论，则需要target参数 传递文章ID
    // 2-如果是对用户留言进行评论回复，则需要target参数 传递评论ID
    target:{ // 父组件传入的文章id
      type: [String, Number, Object],
      required: true
    },
    // 2-如果是对用户留言进行评论回复，则articleId参数 传递文章ID
    articleId: { // 如果父组件没有传值，默认值null
      type: [String, Number, Object],
      default: null
    }
  },

  computed: {},

  created() {},

  mounted() {
    // this.$refs.commentRef.onFocus();
  },

  watch: {},

  methods: {
    async onPost(){ // 点击发布按钮，触发发起评论请求
      // .添加loading状态防止用户频繁点击发布
      this.$message.loading({
        message: '发布中...',
        forbidClick: true, //禁止背景点击，类似于按钮处理加载状态，但是loading相当于有一个遮罩
        duration: 0 // 展示时长(ms)，值为 0 时，toast一直展示，默认是2000
      });
      const params = {
        // 使用toString()防止超出JS安全准入范围
        target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: this.comment, // 评论内容	
        art_id: this.articleId ? this.articleId.toString() : null // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。	
      }
      // 封装请求方法
      // 请求提交数据
      const {data:res} = await addComment(params)
      console.log(res);
      // 处理响应数据
      if(res.message === 'OK'){
        this.$message.success('发布评论成功')
        this.comment = '' // 清空内容
        // 触发父组件的函数，将控制popup弹出层的属性值进行关闭
        // this.$emit('post-success',false) //将后端返回的数据单条评论对象，push到 组件中的
        // this.$bus.$emit('addComment',res.data.new_obj) // 将后端返回的数据单条评论对象，push到 组件中的兄弟组件，通过全局事件中心处理，去触发comment-list自定事件
        this.$emit('post-success',res.data.new_obj)
      }else{
        this.$message.fail('发布评论失败')
      }
    }
  }
}

</script>
<style lang='less' scoped>
.post-comment{
  padding: 14px;
  display: flex;
  align-items: center;
  .post-btn{
    width: 60px;
  }
}
</style>