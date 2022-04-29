<!--
* @description 
* @fileName index.vue
* @author echo9z
* @date 2022/04/29 10:25:25
!-->
<template>
  <div class="article-item">
    <van-cell >
      <template v-slot:title>
        <!-- vant组件中 van-multi-ellipsis--l3 文字超过三号就用省略号替代 -->
        <div class="title van-multi-ellipsis--l3">
          {{article.title}}
        </div>
      </template>

      <!-- 底部作者 评论 发布时间 -->
      <template v-slot:label>
        <!-- 判定如果图片封面为3 时渲染 -->
        <div class="cover-wrap" v-if="article.cover.type === 3">
          <!-- 遍历图片数组 -->
          <div class="cover-wrap-item" :key="i" v-for="(img,i) in article.cover.images">
            <van-image 
              class="cover-img"
              fit="cover"
              :src="img"
            />
          </div>
        </div>
        <!-- label部分 -->
        <div class="label-warp">
          <!-- 文章作者 -->
          <span>echo9z</span>
          <span>{{article.comm_count}}评论</span>
          <span>{{article.pubdate | relativeTime}}</span>
        </div>
      </template>
      
      <!-- 默认插槽 default可以省略 在左侧显示 -->
      <template >
        <!-- 判断只有一个封面的item -->
        <van-image class="right-cover"
          v-if="article.cover.type === 1"
          fit="cover"
          :src="article.cover.images[0]"
        />
      </template>

    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'ArticleItem',

  data () {
    return {
    }
  },

  components: {},

  props: {
    article:{
      type: Object,
      required: true
    }
  },

  computed: {},

  created() {},

  //mounted: {},

  methods: {

  }
}

</script>
<style lang='less' scoped>
.article-item{
  //标题
  .title{
    font-size: 16px;
    color: #3a3a3a;
  }

  // 有三张封面
  .cover-wrap{
    display: flex;
    padding: 5px 0 15px;
    .cover-wrap-item{
      height: 73px;
      flex: 1;
      .cover-img{ //图片大小
        width: 100%;
        height: 73px;
      }
    }
    .cover-wrap-item:nth-child(2){ 
      margin: 0 2px;
    }
  }
  // 只有一个封面时，当图片所占的位置一份flex:1，取消； 
  .van-cell__value{
    flex:unset;
    width: 116px;
    height: 73px;
    margin-left: 5px;
  }
  // 作者 评论
  .label-warp{
    span{
      font-size: 12px;
      color:#b4b4b4;
      margin-right: 12px;
    }
  }
}
</style>