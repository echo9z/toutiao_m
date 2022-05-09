<!--
* @description 搜素结果
* @fileName search-result.vue
* @author echo9z
* @date 2022/05/04 11:11:16
!-->
<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell 
        v-for="(result,index) in searchList" 
        :key="index" 
        :title="result.title"
        :to="{
          name: 'article',
          params: {
            articleId: result.art_id
          }
        }" />
    </van-list>
  </div>
</template>

<script>
import {getSearchResult} from '@/api/search.js'

export default {
  name: 'SearchResult',

  data () {
    return {
      searchList:[], 
      loading: false, //控制加载中loading状态，true正在加载，false结束本次加载
      finished: false, //当为true时 不会在触发load事件，下拉时就不再加载更多
      params: {
        page: 1, // 页数
        per_page: 10, // 每页数量
        q: this.searchText
      }
    }
  },

  components: {},

  props: {
    searchText:{
      type: String,
      required: true
    }
  },

  computed: {},

  created() {},

  //mounted: {},

  methods: {
    async onLoad() {
      // 1.请求获取数据
      const {data:res} = await getSearchResult(this.params)
      console.log(res);
      // 2.将数据放到数据列表中
      const {results} = res.data
      this.searchList.push(...results)
      // 3.关闭本次加载状态
      this.loading = false
      // 4.判断是否还有数据
      //   如果有，则更新获取下一页数据的页面
      //   如果没有，则把finished设置为true，关闭家中更多
      // const count = res.data.total_count
      // const per_page = res.data.per_page
      // if(this.params.page <= Math.floor(count/per_page)){
      if(results.length){ // 返回的数组存在元素
        this.params.page = this.params.page + 1
        console.log(this.params.page);
      }else{
        this.finished = true
      }
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.searchList.push(this.searchList.length + 1);
      //   }

      //   // 加载状态结束
      //   this.loading = false;

      //   // 数据全部加载完成
      //   if (this.searchList.length >= 40) {
      //     this.finished = true;
      //   }
      // }, 1000);
    },
  }
}

</script>
<style lang='less' scoped>
.search-result{ // 搜索结果内部的滚动容器
    position: fixed;
    left: 0;
    right: 0;
    top: 54px;
    bottom: 0;
    overflow-y: auto;
}
</style>