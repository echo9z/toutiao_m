<!--
* @description 
* @fileName index.vue
* @author echo9z
* @date 2022/04/25 13:57:00
!-->
<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="登录"
      left-arrow 
      @click-left="$router.back()" /> <!-- $router.back()返回上一次访问路径 -->

      <!-- 登录表单 -->
      <!-- 基于Vant表达验证
          1.使用van-form组件包裹所有的表达项 van-field
          2.给van-form 绑定submit事件，当表单提交的时候触发submit事件
            注意：只有表单验证通过，它才会调用submit事件 
          3.使用 Field 的 rules 属性定义校验规则。
        show-error:校验不通过时，是否显示红色输入框
        show-error-message:校验不通过时，是否显示下方红色错误提示信息
        failed:表单验证没有通过，会触发onFailed函数，error中包含出错误提示信息
        validate-first:当有某一项验证不通过，直接停止后面的校验 -->
      <van-form 
        ref="loginForm"
        :show-error="false"
        :show-error-message="false" 
        validate-first
        @submit="onLogin"
        @failed="onFailed">
        <van-field
          v-model="user.mobile"
          icon-prefix="toutiao"
          left-icon="shouji"
          placeholder="请输入手机号"
          name="mobile"
          :rules="formRules.mobile"
        />
        <van-field
          v-model="user.code"
          clearable
          icon-prefix="toutiao"
          left-icon="yanzhengma"
          placeholder="请输入验证码"
          name="code"
          :rules="formRules.code"
        >
          <!-- 插入标签 -->
          <template #button>
            <!-- size按钮大小，圆角round 
            注意将native-type设置为button，否则会触发表单提交。
            loading:属性设置按钮为加载状态，加载状态下默认会隐藏按钮文字，-->
            <van-button 
              size="small" 
              class="send-btn"
              round
              native-type="button"
              v-if="!isDownCount"
              :loading='isSendSmsLoading'
              @click="onSendSms">发送验证码</van-button>
            <!-- 倒计时组件
              format:用于显示时间的格式，ss只保留 秒
              finish：倒计时结束时触发函数 -->
            <van-count-down :time="time" 
              format="ss s" v-else @finish="countDown"/>
          </template>
        </van-field>

        <!-- 登录按钮
          block：属性可以将按钮的元素类型设置为块级元素。 -->
        <div class="login-btn-wrap">
          <van-button type="info" native-type="submit" block class="login-btn">登录</van-button>
        </div>
      </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111', //手机号
        code: '246810' //验证码
      },
      formRules:{ //表单验证规则
        mobile:[
          { required: true, message: '请输入手机号' },
          { 
            pattern: /(^[1][3578][0-9]{9}$)|(^[1][4][357]{8}$)|(^[1][6][0567][0-9]{8}$)|(^[1][9][89][0-9]{8}$)/,
            message: '手机号格式错误'
          }
        ],
        code:[
          { required: true, message: '请输入验证码' },
          { 
            pattern:/^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      //倒计时 毫秒为单位
      time: 1000 * 5,
      isDownCount:false, //用于控制显示和隐藏倒计时 和 发送按钮
      isSendSmsLoading: false, //发按钮状态，用于用户点击完以后，按钮处于加载状态
    }
  },

  components: {},

  props: {},

  computed: {},

  created() {},

  //mounted: {},

  methods: {
    // form 表单验证通过，触发submit函数
    async onLogin(){
      this.$message.loading({
        message: '登录中...',
        forbidClick: true, //禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast一直展示，默认是2000
      });
      // 1找到数据接口
      // 2封装请求方法
      // 3调用登录接口
      try {
        const res = await login(this.user)
        if(res.status === 201) this.$message.success('登录成功')
        console.log(res);
        // 4处理响应结果
        // 将后端的响应结果 存放到vuex中 容器中
        this.$store.commit('setUser',res.data.data)

        //5.登录成功跳转我的个人页面
        this.$router.back(); //从那个页面来 退回到那个页面
        //上面存在问题，先暂时用着
      } catch (error) {
        console.log(error);
        return this.$message.fail('登录失败，手机号或验证码错误')
      }
      
    },

    //failed:表单验证没有通过，会触发onFailed函数，error中包含出错误提示信息
    onFailed(error){
      console.log(error);
      //提示信息去 form表单中错误信息的第一个元素
      if(error.errors[0]){
        this.$message({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },

    // 发短信逻辑
    async onSendSms(){
      // 校验手机号码  只校验field组件中name属性为mobile的文本框内容
      // this.$ref.loginForm.validate('mobile').then(data => { //data 验证失败结果提示消息
      //   console.log(data);
      // }) 
      try {
        await this.$refs.loginForm.validate('mobile') //validate验证通过为undefined
        this.isSendSmsLoading = true //显示loading按钮，防止用户多次请求
        //验证通过请求发送验证码
        /**
         * 这个地方如果存在网络延迟情况，如果用户点击一次，没有响应，
         * 用户可能不断点击，就会一次发送了多个请求，存在一个节流问题，
         * 应该第一次点击让按钮处于禁用或加载状态，让用户第一次点击时以后的点击时无效的
         */
        const res = await sendSms(this.user.mobile) 
        console.log(res);

        //短信发送出去，隐藏发送按钮，显示倒计时
        this.isDownCount = true 
        //倒计时结束 => 隐藏倒计时，显示发送按钮
        //当vant 倒计时组件结束后触发finish函数将isDownCount该false
      } catch (error) { //error为validate验证错误的信息对象
        console.log('验证失败',error);
        // console.dir(error);
        //根据不同错误 需要提示不同的信息
        let message = ''
        if(error.name === 'mobile'){
          message = error.message
        }else if(error && error.response && error.response.status === 429){
          message= '短信发送过于频繁'
        }else{
          // 未知错误
          message = "发送失败，请稍后重试"
        }
        // 最后做提示信息
        this.$message({
          message,
          position: 'top'
        })
      }
      // 验证通过 => 请求接口发送验证码 => 用户接受验证码 => 输入验证码 => 请求登录
      // 请求发送验证码 => 隐藏发送按钮，显示倒计时
      // 倒计时结束 => 隐藏倒计时，显示发送按钮
      // 无论发送时成功还是失败，取消加载按钮
      this.isSendSmsLoading = false 
    },
    //当倒计时时间结束，触发finish函数，修改isDownCount隐藏隐藏倒计时，显示发送按钮
    countDown(){
      this.isDownCount = false //隐藏倒计时
    }
  }
}

</script>
<style lang='less' scoped>
.login-container{
  .send-btn{ // 发送验证码按钮
    width: 78px;
    height: 23px;
    background-color: #ededed;
    .van-button__text{
      font-size: 11px;
      color:#666;
    }
  }
  
  //登录按钮样式
  .login-btn-wrap{
    padding: 26px 15px;
    .login-btn{
      background-color: #6db4fb;
      border: none;
      .van-button__text{
        font-size: 15px;
      }
    }
  }


}

</style>