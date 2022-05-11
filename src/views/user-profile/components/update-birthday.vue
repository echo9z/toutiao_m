<!--
* @description 修改生日
* @fileName update-birthday.vue
* @author echo9z
* @date 2022/05/10 16:22:37
!-->
<template>
  <div class="update-birthday">
    <!-- 
      type:组件显示的类型
      min-date:选择最小日期
      max-date:选择最大日期
    -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onConfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
import {setUserProfile} from '@/api/user'
import {getFormatDate} from '@/utils/dayjs'


export default {
  name: 'UpdateBirthday',

  data () {
    return {
      minDate: new Date(1910, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    }
  },

  components: {},

  props: {
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
    async onConfirm(value){
      // 请求提交更新用户生日
      // 更新如组件中的用户生日
      // 关闭弹出层
      // console.log(value);
      // console.log(getFormatDate(value,'YYYY-MM-DD'));
      this.$message.loading({
        message: '保存中...',
        forbidClick: true, //禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast一直展示，默认是2000
      });
      try {
        //请求提交更新用户生日
        const {data:res} = await setUserProfile({
          birthday: getFormatDate(value,'YYYY-MM-DD')
        })
        if(res.message === 'OK'){
          this.$emit('input',getFormatDate(value,'YYYY-MM-DD')) // 发布事件 更新父组件中v-model中的数据
          this.$message.success('修改生日成功')
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