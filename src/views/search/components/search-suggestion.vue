<!--
* @description 搜索框联想关键词
* @fileName search-suggestion.vue
* @author echo9z
* @date 2022/05/04 10:14:49
!-->
<template>
  <div class="search-suggestion">
    <!-- search点击每个联想词，触发组件的搜索 -->
    <van-cell 
      v-for="(item,index) in suggestionList"
      :key="index"
      icon="search"
      @click="search(item)" >
      <template v-slot:title>
        <div v-html="highlight(item)"></div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import {getSearchSuggestion} from '@/api/search.js'
import {debounce} from 'lodash' //按需加载 加载防抖函数

export default {
  name: 'SearchSuggestion',

  data () {
    return {
      suggestionList:[], //搜索关键词联想列表
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

  watch:{ // 监听器，当数据发生改变，会触发监听函数
    // searchText:() => { // 当searchText 数据发生改变，发起请求，返回联想关键词数据
    //   console.log(1);
    // }
    // 上面这样写存在一个问题，当第一次输入时searchText由''变为"a",并没有触发监听，原因是 SearchSuggestion组件还没成功渲染到页面上监听器就不存在，所有就监听到值得变化
    // 监视器完整的写法
    searchText:{
      handler: debounce(async function(){
        console.log('suggestion');
        // 请求获取接口
        // 将数据绑定展示
        const {data:res} = await getSearchSuggestion(this.searchText)
        console.log(res);
        this.suggestionList = res.data.options
      },400),    // 1秒之内，用户再次输入，不发送请求
      // async handler(){
      //   console.log(1);
      //   // 请求获取接口
      //   // 将数据绑定展示
      //   const {data:res} = await getSearchSuggestion(this.searchText)
      //   console.log(res);
      //   this.suggestionList = res.data.options
      // },
      // immediate为true，该回调将会在侦听开始之后立即调用，即组件渲染完，就触发一次handler函数，
      // 因为该组件是用户输入内容时该组件进行渲染，第一次searchText的值为用户输入内容，通过immediate: true，一上来就触发一次handler函数
      immediate: true //理解为初始化完毕后上来就触发handler函数
    }
  },
  //mounted: {},

  methods: {
    // 通过字符串
    highlight(str){
      console.log(str);
      if(this.suggestionList[0]){
        const reg = new RegExp(this.searchText,'gi') // 做全局 忽略大小写
        return str.replace(reg,`<span style="color:#3296fa">${this.searchText}</span>`)
      }
      return str
    },
    // 点击联想的关键词，触发父组件的onSearch搜索函数
    search(suggestion){ //suggestion 为联想的内容
      this.$emit('onSearch',suggestion)
    }
  }
}

</script>
<style lang='less' scoped>
</style>