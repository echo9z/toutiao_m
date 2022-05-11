<!--
* @description 
* @fileName update-name.vue
* @author echo9z
* @date 2022/05/09 21:37:13
!-->
<template>
  <div class="update-name">
    <van-field
      class="text"
      v-model.trim="name"
      rows="1"
      type="textarea"
      maxlength="20"
      placeholder="请输入昵称"
    />
    <van-nav-bar
      class="handel-name"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm" /> 
  </div>
</template>

<script>
import {setUserProfile} from '@/api/user'

export default {
  name: 'UpdateName',

  data () {
    return {
      name: this.value ||''
    }
  },

  components: {},

  props: {
    // 声明接收 父组件的v-model 传递的value数据
    value:{
      type: String,
      required: true
    }
  },

  computed: {},

  created() {},

  //mounted: {},

  watch: {},

  methods: {
    async onConfirm(){ // 确认提交修改昵称
      if(this.name === this.value) return this.$emit('close')
      this.$message.loading({
        message: '保存中...',
        forbidClick: true, //禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast一直展示，默认是2000
      });
      try {
        //请求提交更新用户昵称
        const {data:res} = await setUserProfile({
          name: this.name
        })
        console.log(res);
        if(res.message === 'OK'){
          // this.$emit('success-name',this.name)
          this.$emit('input',this.name) // 发布事件 更新父组件中v-model中的数据
          this.$message.success('修改昵称成功')
        }
        this.$emit('close')
      } catch (error) {
        console.log(error);
        if(error && error.response && error.response === 409){
          this.$message.fail('修改昵称已存在')
        }
      }
    }
  }
}

</script>
<style lang='less' scoped>
.update-name{
  .text{
    margin-top: 20px;
    padding: 15px 35px 0;
  }
  .handel-name{
    /deep/.van-nav-bar__left{
      left: 40px;
    }
    /deep/.van-nav-bar__right{
      right: 40px;
    }
  }
}
</style>