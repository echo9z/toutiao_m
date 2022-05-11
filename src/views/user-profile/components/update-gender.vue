<!--
* @description 更新性别
* @fileName update-gender.vue
* @author echo9z
* @date 2022/05/10 15:29:40
!-->
<template>
  <div class="update-gender">
    <!-- 滑动选择器
    default-index：单列选择时，默认选中项的索引 -->
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      :default-index="genderIndex"
    />
  </div>
</template>

<script>
import {setUserProfile} from '@/api/user'

export default {
  name: 'UpdateGender',

  data () {
    return {
      columns:['男','女'],
      genderIndex: this.value
    }
  },

  components: {},

  props: {
    // 声明接收 父组件的v-model 传递的value数据
    value:{
      type: [Number,String],
      required: true
    }
  },

  computed: {},

  created() {},

  //mounted: {},

  watch: {},

  methods: {
    async onConfirm(value,index){
      // console.log(value,index);
      this.$message.loading({
        message: '保存中...',
        forbidClick: true, //禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast一直展示，默认是2000
      });
      try {
        this.genderIndex = index
        //请求提交更新用户昵称
        const {data:res} = await setUserProfile({
          gender: index
        })
        console.log(res);
        if(res.message === 'OK'){
          this.$emit('input',index) // 发布事件 更新父组件中v-model中的数据
          this.$message.success('修改性别成功')
        }
        this.$emit('close')
      } catch (error) {
        console.log(error)
      }
    }
  }
}

</script>
<style lang='less' scoped>
</style>