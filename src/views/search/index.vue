<!--
* @description article search
* @fileName index.vue
* @author echo9z
* @date 2022/05/03 17:07:42
!-->
<template>
  <div class="search">
    <!-- 搜索框
    show-action:出现一个取消按钮 
    外层增加 form 标签，且 action 不为空，即可在 iOS 或 And输入法中显示搜索按钮。
    @focus:当前搜索聚焦时，关闭搜索结果-->
    <form action="/"> 
      <van-search 
        v-model="searchText" 
        placeholder="请输入搜索关键词" background="#3296fa"
        @search="onSearch(searchText)"
        @cancel="onCancel"
        @focus="onFocus"
        show-action />
    </form>
    <!-- /搜索框 -->

    <!-- 搜索结果 
      isResultShow:如果用户触发回车或点击搜索，将isResultShow值为true，处于显示状体-->
    <search-result 
      v-if="isResultShow"
      :searchText='searchText'
      ></search-result>
    <!-- /搜索结果 -->

    <!-- 关键词联想 
      searchText:如果搜索框的内容不为空，则显示联想关键词
      -->
    <search-suggestion 
      v-else-if="searchText"
      v-on:onSearch="onSearch($event)"
      :searchText='searchText'
      ></search-suggestion>
    <!-- /关键词联想 -->

    <!-- 历史记录
      上面两个条件都不满足，则已进入搜索页面展示的是搜索历史记录 -->
    <search-history
      v-else
      v-on:onSearch="onSearch($event)"
      v-on:update-history="searchHistory = []"
      :searchHistory='searchHistory'
    ></search-history>
    <!-- /历史记录 -->

    
  </div>
</template>

<script>
import {mapState} from 'vuex'
import SearchSuggestion from './components/search-suggestion.vue' 
import SearchHistory from './components/search-history.vue' 
import SearchResult from './components/search-result.vue' 
import {setItem,getItem} from '@/utils/storage.js'

export default {
  name: 'SearchIndex', 

  data () {
    return {
      searchText:'', // 输入框的内容
      isResultShow: false, // 控制搜索结果的状态
      searchHistory: getItem('toutiao-search-history')||[] // 搜索历史数据，如果第一次获取，如果
    }
  },

  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },

  props: {},

  computed: {
    ...mapState(['user'])
  },

  created() {

  },

  //mounted: {},

  methods: {
    onSearch(searchText){ //在点击键盘上的搜索/回车按钮后触发
      console.log('onSearch');
      this.searchText = searchText

      // 这里去重，比如第一次搜索abc，向数组中添加数据；第二次搜索abc，不应该往数组中添加数据，这样就是重复历史关键词内容
      const index = this.searchHistory.indexOf(searchText)
      if(index !== -1){
        // index不为-1则有重复数据，根据index将元素删除
        this.searchHistory.splice(index, 1)
      }

      // 向搜索历史数组添加记录，同时向数组的第一个位置插入
      this.searchHistory.unshift(searchText)

      // TODO:搜索历史记录持久化
      setItem('toutiao-search-history',this.searchHistory)
      // if(this.user){
      //   // 如果用户已经登录，则把搜索历史记录存储到线上
      //   //    提示：只有调用搜索所结果的数据接口，后端会自动存储用户的搜索历史记录
      //   setItem('touxiao-search-history',this.searchHistory)
      // }else{
      //   // 如果没有登录，则把搜索历史记录存储到本地
      //   setItem('touxiao-search-history',this.searchHistory)
      // }

      // 展示搜索结果
      this.isResultShow = true
    },
    onCancel(){ //在点击搜索框右侧取消按钮时触发
      this.$router.back() // 点击取消返回之前的浏览页面
      console.log('onCancel');
    },
    onFocus(){ // 搜索框聚焦时，触发函数，将搜索结果隐藏
      if(this.isResultShow){
        this.isResultShow = false
      }
    },
  }
}

</script>
<style lang='less' scoped>
.search{
  .van-search__action{
    color: #fff
  }
}
</style>