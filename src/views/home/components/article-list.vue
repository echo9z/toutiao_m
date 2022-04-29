<!--
* @description 
* @fileName article-list.vue
* @author echo9z
* @date 2022/04/28 11:26:25
!-->
<template>
  <div class="article-list">
    <!-- 
      下拉刷新组件 pull-refresh
      v-model绑定的值为false表示加载完成，true为下拉加载中
      success-text:属性成功的文本
      success-duration:刷新成功展示内容的延长时间
    -->
    <van-pull-refresh 
      v-model="pullDownRefreshing" 
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1000"
    >
<!-- 
  List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 设置成 true，此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
- `load 事件`：
  - List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
  - 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
- `loading 属性`：控制加载中的 loading 状态
  - 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
  - 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件
- `finished 属性`：控制加载结束的状态
  - 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
  - 所有数据加载结束，finished 为 true，此时不会触发 load 事件
-->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item 
          v-for="(article,index) in articlesList" 
          :key="index" 
          :article="article"
          >

        </article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/'

export default {
  name: 'article-list',
  props:{
    channel:{
      type: Object, //channel类型 对象类型
      required: true //必须传入的
    }
  },
  data () {
    return {
      articlesList: [], //数据列表
      loading: false, //控制加载中loading状态，true正在加载，false结束本次加载
      finished: false, //当为true时 不会在触发load事件，下拉时就不再加载更多
      timestamp: null, // 记录本次请求文章列表的时间戳，用于下一次下拉请求文章列 即下一页
      pullDownRefreshing: false, //处于下拉刷新状态
      refreshSuccessText: '' // 下拉刷新 提示有刷新的多少条数据
    }
  },
  
  components: {
    ArticleItem
  },

  computed: {},

  created() {
  },

  //mounted: {},

  methods: {
    /* async getCurrentTimestamp(){
      // 获取当前时间的文章列表
      // this.channel 传入的频道对象
      const params = {
        channel_id:this.channel.id,
        timestamp:Date.now()
      }
      const {data:res} = await getArticles(params)
      console.log(res);
      this.list = res.data.results
    }, */
    // 当van-list组件加载时 或者 组件向下滚动到底部，会触发onLoad事件，自动将loading设置为true处于加载中，当页面内容加载屏幕的底部，停止加载loading设置为false
    async onLoad (){
      console.log('loading')

      // 异步更新数据
      // 1.发起ajax异步请求，获取数据
      const params = {
        channel_id: this.channel.id, //频道id
        // timestamp: Date.now() //timestamp 相当于请求的页码，请求最新数据使用当前最新事件戳，下一页数据使用的上一次返回的数据中的时间戳
        timestamp: this.timestamp || Date.now()  //第一次没有记录timestamp值，则用Date.now()最新的时间戳
      }
      const {data:res} = await getArticles(params)
      console.log(res)
      this.timestamp = res.data.pre_timestamp
      console.log(this.timestamp);
      // 2.将获取的数据存放到list数组中，注意：是push进数组中
      const {results} = res.data
      this.articlesList.push(...results) //通过过数组展开运算符，比如 arr1 = [1,2,3] arr2=[4,5,...arr1]=>[4,5,1,2,3]
      // 3.本次加载状态结束，设置为false，便于下一次判断是否需要加载，如果不设置该值，loading永远是true，状态一直处于加载状态
      this.loading = false
      
      // 4.数据全部加载完成
      if(results.length){
        // 更新获取下一页的数据的页面，即根据上一次请求的后端返回的数据中timestamp时间戳，去获取文章数据
        params.timestamp = this.timestamp
      }else{ //如果数组元素 为0，则停止加载
        // 没有数据结束时，把加载状态设置位false不会在触发load事件
        this.finished = true // 当数据全部被加载完毕后，就不会在触发load事件，下拉时就不再加载了
      }
    },
    // 下拉刷新 触发函数，自动将pullDownRefreshing值设置为true
    async onRefresh(){
      console.log('pullDown');
      // 执行下拉操作将
      const params = {
        channel_id: this.channel.id, //频道id
        timestamp: Date.now() //timestamp 相当于请求的页码，请求最新数据使用当前最新事件戳，下一页数据使用的上一次返回的数据中的时间戳
      }
      try {
         //1.请求获取数据
        const {data:res} = await getArticles(params)
        console.log(res)
        this.timestamp = res.data.pre_timestamp
        if (this.pullDownRefreshing) { //是否操作的下拉刷新，如果是pullDownRefreshing为true加载中状态，清空article列表数据
            //2.把返回最新数据 往顶部追加数据
            const {results} = res.data
            this.articlesList.unshift(...results); //将最新的数据插入到 文章列表的最前面

            //3.关闭下拉刷新 loading 状态
            this.pullDownRefreshing = false; // 停止下拉刷新操作，
            this.$message('刷新成功')
            this.refreshSuccessText = `更新了${results.length}条数据` // 刷新成功提示内容
        }
      } catch (error) {
        this.pullDownRefreshing = false;
        this.$message.fail('刷新失败')
      }
    }
  }
}

</script>
<style lang='less' scoped>
// 让文章组件的列表 进行固定定位，不要让底部的banner 挡住了，加载中效果
.article-list{
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  overflow-y:auto; //根据分配给overflow-y属性的值，可以剪切，隐藏内容或相应地显示滚动条。
  /**
    scroll:溢出用滚动条下拉显示内容 | hidden:溢出隐藏内容 | visible:溢出内容的显示 | auto
   */
}
</style>