<!--
* @description 文章详情
* @fileName index.vue
* @author echo9z
* @date 2022/05/06 07:57:24
!-->
<template>
  <div class="article-container">
    <!-- 文章导航 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow 
      @click-left="$router.back()"
    />

    <!-- 文章具体内容  -->
    <div class="article-info">
      <!-- 标题 -->
      <h1 class="title">{{article.title}}</h1>
      <!-- 文章作者 头像 关注 -->
      <div>
        <van-cell center class="author-info" >
          <!-- <div slot="title" class="author-name">{{article.aut_name}}</div> -->
          <div slot="title" class="author-name">echo9z</div>
          <van-image 
            slot="icon"
            class="author-avatar"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="label" class="pubdate">
            {{article.pubdate | relativeTime}}
          </div>
          <!-- 关注按钮 -->
          <van-button 
            class="follow-btn"
            round 
            size='small'
            :loading='loadingFollow'
            :type="article.is_followed ? 'default': 'info'"
            :icon="article.is_followed ? '': 'plus'"
            @click="onFollow"
            >{{article.is_followed ? '已关注': "关注"}}</van-button>
        </van-cell>
      </div>
      <!-- 文章内容 
      图片+后端返回html文本内容，用于做测试的，原因是后端返回的img图片链接都是失效了的，或者就手动的添加一张图，为结下来做预览-->
      <!-- 
      http://localhost:8080/#/article/8175
      http://localhost:8080/#/article/7768 -->
      <div 
        class="content markdown-body" 
        v-html="article.content"
        ref="article-content">
      </div>
    </div>

    <!-- 评论 点赞 -->
    <div class="article-bottom">
      <!-- 评论按钮 -->
      <van-button
        class="comment-btn"
        type="default"
        round
        size='small'
      >写评论</van-button>
      <!-- 有多少人评论了 -->
      <van-icon 
        name="chat-o" 
        badge="99+" 
      />
      <!-- 收藏 -->
      <van-icon
        :color="article.is_collected? 'orange' :'#777'"
        @click="onCollected"
        :loading='loadingCollected'
        :class="{'is-collected':article.is_collected}"
        :name="article.is_collected ? 'star':'star-o'"
      />
      <!-- 点赞 -->
      <van-icon
        @click="onLike"
        :color="article.attitude===1? 'red':'#777'"
        :name="article.attitude===1? 'good-job':'good-job-o'"
      />
      <!-- 分享 -->
      <van-icon name="share" color="#777777"></van-icon>
    </div>
  </div>
</template>

<script>
import {getArticleId,addCollectionsArticle,delCollectionsArticle,
  addLikeArticle,delLikeArticle} from '@/api/article.js'
// 加载github markdown 文章样式
import './github-markdown.css'
import { ImagePreview } from 'vant';
import { addFollowUser,delFollowUser } from '@/api/user.js';

// ImagePreview({ // van 中图片预览使用
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg',
//   ],
//   startPosition: 1,
// });

export default {
  name: 'ArticleIndex',

  data () {
    return {
      article:{}, // 文章信息
      loadingFollow: false, // 用于 当用户点击关注按钮处于加载状态，方式用户多次点击发送请求
      loadingCollected: false // 用于 当用户点击收藏按钮处于加载状态，方式用户多次点击发送请求
    }
  },

  components: {},

// 在组件中获取动态路由参数：
//    方式一：this.$router.params.xxx
//    方式二：props 参数。推荐
  props: {
    // 文章id参数，来自于router参数，具体在 @/router/的article中
    articleId:{
      type: [String, Number, Object],
      required: true
    }
  },

  computed: {},

  created() {
    this.loadArticle()
  },

  //mounted: {},

  watch: {},

  methods: {
    async loadArticle(){
      const {data:res} = await getArticleId(this.articleId)
      console.log(res);
      this.article = res.data

      // 获取文章内容 DOM容器
      // 得到有所得img标签
      // 循环img列表，给img 注册点击事件
      // 在事件处理函数调用 ImagePreview 图片预览函数
      this.handlePreviewImage()
    },
    // 处理文章图片预览
    handlePreviewImage(){
      // 数据改变影响视图更新（DOM数据）不是立即的，所有如果需要在修改数据之后马上操作被该数据影响的视图DOM，需要把这代码放在$nextTick中
      this.$nextTick(() => { // $nextTick 提供的方法，如果修改数据，但vu没有立即更新到页面的dom中，但是这里修改数据后立即要过去dom元素，就可以使用nextTick函数
        // 1.获取文章内容 DOM容器
        const articleContent = this.$refs['article-content']
        console.log(articleContent);
        
        // 2.得到有所得img标签
        const imgs = articleContent.querySelectorAll('img')
        console.log(imgs)

        const imgPaths = [] // 搜集所有图片src
        imgs.forEach((img,index) => {
          imgPaths.push(img.src) // 将获取dom元素的img的src 添加的imgPaths数组中
          // 3.循环img列表，给img 注册点击事件
          img.onclick = () => {
            // 4.在事件处理函数调用 ImagePreview 图片预览函数
            ImagePreview({ // van 中图片预览使用
              images: imgPaths,
              startPosition: index, // 点击图片预览位置
            });
          }
        });
      })
    },
    // 点击关注，如果已关注，点击执行取消关注；如果未关注，点击执行关注
    async onFollow(){
      // 点击按钮，处于加载状态，防止用户多次点击发送请求
      this.loadingFollow = true 
      if(this.article.is_followed){
        // 1.已关注，取消关注
        await delFollowUser(this.article.aut_id)
        // 取消后，将已关注按钮 变为 关注按钮
        // this.article.is_followed = false
      }else{
        // 2.未关注，关注
        await addFollowUser(this.article.aut_id)
        // 取消后，将关注按钮 变为 已关注按钮 
        // this.article.is_followed = true
      }
      // 3. 取消后，将关注按钮 变为 已关注按钮 
      this.article.is_followed = !this.article.is_followed
      this.loadingFollow = false 
    },
    // 点击收藏文章
    async onCollected(){
      // 5.添加loading状态防止用户频繁点击
      this.$message.loading({
        message: '处理中...',
        forbidClick: true, //禁止背景点击，类似于按钮处理加载状态，但是loading相当于有一个遮罩
        duration: 0 // 展示时长(ms)，值为 0 时，toast一直展示，默认是2000
      });
      if(this.article.is_collected){
        // 1.已关注，取消关注
        await delCollectionsArticle(this.article.art_id)
      }else{
        // 2.未关注，关注
        await addCollectionsArticle(this.article.art_id)
      }
      // 3. 取消后，将已收藏图标 变为 未收藏图标，或者 将未收藏图标 变为 已收藏图标
      this.article.is_collected = !this.article.is_collected
      // 4. 提示是否成功收藏
      this.$message.success(`${ this.article.is_collected ? '收藏成功' :'取消收藏'}`)
    },
    // 点击点赞文章
    async onLike(){
      // 5.添加loading状态防止用户频繁点击
      this.$message.loading({
        message: '处理中...',
        forbidClick: true, //禁止背景点击，类似于按钮处理加载状态，但是loading相当于有一个遮罩
        duration: 0 // 展示时长(ms)，值为 0 时，toast一直展示，默认是2000
      });
      if(this.article.attitude === 1){
        // 1.已点赞，取消点赞
        await delLikeArticle(this.article.art_id)
        this.article.attitude = -1
      }else{
        // 2.未点赞，进行点赞
        await addLikeArticle(this.article.art_id)
        this.article.attitude = 1
      }
      // 3. 取消后，将已收藏图标 变为 未收藏图标，或者 将未收藏图标 变为 已收藏图标
      // this.article.is_collected = !this.article.is_collected
      // 4. 提示是否成功点赞
      this.$message.success(`${ this.article.attitude === 1 ? '成功点赞' :'取消点赞'}`)
    }
  }
}

</script>
<style lang='less' scoped>
.article-container{
  background-color: #fff;
  .article-info{ // 包含文章标题 与 文章信息
    background-color: #fff;
    position:fixed;
    top: 46px;
    bottom: 44px;
    left: 0;
    right: 0;
    overflow-y: auto; // 内容产生滚动
    .title{ // 文章标题
      font-size: 20px;
      color: #3a3a3a;
      padding: 0 14px;
    }
    .author-info{ // 作者信息
      .author-avatar{ // 头像
        width: 42px;
        height: 42px;
        padding-right: 8px;
      }
      .author-name{ // 作者名
        font-size: 14px;
        color: #333;
      }
      .pubdate{ //发布日期
        color: #b4b4b4;
        font-size: 12px;
      }
      .follow-btn{
        width: 85px;
        height: 29px;
      }
    }
    // 文章正文内容
    .content{
      padding: 14px;
    }
  }

  .article-bottom{ // 底部位置
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
    .comment-btn { // 写评论按钮
      width: 141px;
      height: 23px;
      border: 2px solid #eeeeee;
      font-size: 14px;
      line-height: 23px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 8px;
        background-color: #e22829;
      }
    }
  }
}
</style>