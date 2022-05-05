<!--
* @description 搜索历史
* @fileName search-history.vue
* @author echo9z
* @date 2022/05/04 10:27:06
!-->
<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <!-- cell的默认插槽，默认在单元格的最右边 -->
      <template>
        <div v-if="isDelShow">
          <!-- 
            prop 中的数据如果是🎵类型（数组，对象）可以修改，注意是修改引用对象下的属性值改变
            比如：user.name = 'tom'、arr.push(123)、arr.splice(1,1)

            但是任何 prop数据的对象不能重新赋值 新的地址值对象，比如arr = [1,2,3,4]
            如果要修改数据，触发父组件函数，让父组件自己修改
          -->
          <span @click="$emit('update-history',[])">全部删除</span>
          &nbsp;&nbsp;
          <span @click="isDelShow=false">完成</span>
        </div>
        <!-- 删除图标 -->
        <van-icon 
          name="delete-o" 
          v-else
          @click="isDelShow=true" 
          ></van-icon>
      </template>
    </van-cell>

    <van-cell
      v-for="(item,index) in searchHistory"
      :key="index"
      :title="item"
      @click="onHistory(index)">
      <!-- 删除小图标的显示 与 隐藏 -->
      <van-icon
        name="close" 
        v-show="isDelShow"/>
    </van-cell>

  </div>
</template>

<script>
import {setItem} from '@/utils/storage.js'

export default {
  name: 'SearchHistory',

  data () {
    return {
      isDelShow: false, // 控制全部删除 与 完成的隐藏 与 显示
    }
  },

  components: {},

  props: {
    searchHistory:{
      type: Array,
      required: true
    }
  },

  computed: {},
  watch: {
    // 监听
    searchHistory(){
      setItem('toutiao-search-history',this.searchHistory) 
    }
  },
  created() {},

  //mounted: {},

  methods: {
    // 删除单条历史记录
    onHistory(index){
      console.log(index);
      if(this.isDelShow){ // 处于删除状态
        this.searchHistory.splice(index,1)
        // 点击每项的小图标，覆盖本地的历史记录 修改本地存储的数据
        // setItem('toutiao-search-history',this.searchHistory) 这里注释掉原因是有watch去监听searchHistory数据变化
      }else{
        // 处于非删除状态，点击历史搜索记录 执行 发起搜索关键词，触发父组件onSearch搜索内容事件
        this.$emit('onSearch',this.searchHistory[index])
      }
    }
  }
}

</script>
<style lang='less' scoped>
</style>