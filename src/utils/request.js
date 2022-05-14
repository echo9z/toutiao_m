/**
 * 请求模块
 */
import axios from 'axios'
import {Toast} from 'vant'
import store from '@/store'
import jsonBig from 'json-bigint'
import router from '@/router'

export const baseURL = 'http://toutiao.itheima.net/'

// refreshTokenReq实例，用于获取新的token
const refreshTokenReq = axios.create({baseURL})

const request = axios.create({
  timeout:3000, //请求3s 超时时间，前端久认为服务异常
  baseURL, //配置请求根路径
  // transformResponse 允许自定义原始的响应数据（字符串） 修改后端返回的数据
  transformResponse: [function (data) {
    // 后端返回的数据可能不是JSON 格式字符串
    // 如果不是的，那么JSONbig.parse() 调用就会报错
    // 所以需要捕获异常，处理异常
    try {
      // console.log(jsonBig.parse(data));
      // 如果转换成功则返回转换的数据结果
      return jsonBig.parse(data)  
    } catch (err) {
      console.log(data);
      console.log('转换失败',err);
      // 如果转换失败，则包装为统一数据格式并返回
      return data
    }
  }]
})

//请求拦截器
request.interceptors.request.use(function (config) {
  // 在发起请求是，统一添加 Authorization 请求头
  const user = store.state.user
  if(user){
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // console.log(config.headers.Authorization);
  return config
},function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
})

//响应拦截器
request.interceptors.response.use(function (response) {
  // http响应的状态码为：2xx，执行这里逻辑 如果用户token过期，如2个小时过期
  return response;
},async function (error) {
  // 超过 2xx的响应状态码，比如3xx 4xx 5xx 都会执行这里逻辑 
  console.dir(error);
  const status = error.response.status
  if( status === 400 ){
    // 客户端提交的参数错误 比如验证码
    Toast.fail('客户端请求参数异常')
  }else if( status === 401){
    //token无效
    // 如果没有 user 或者 user.token，直接去登录
    const user = store.state.user
    if(!user || !user.token){
      // 直接跳转至登录页
      return redirectLogin()
    }
    // 如果有 refresh_token，则请求获取新的token
    // 拿到新的token之后把它更新到容器中
    // 把失败的请求重新发出去
    try {
      // 根据refresh_token 获取新的 token
      console.log(user.refresh_token);
      const {data:res} = await refreshTokenReq({
        method: 'put',
        url: '/v1_0/authorizations',
        headers: {
          Authorization:`Bearer ${user.refresh_token}`
        }
      })
      console.log(res);
      // 拿到新的token之后把它更新到容器中
      user.token = res.data.token
      console.log(user);
      store.commit('setUser',user)
      // 把失败的请求重新发出去
      // error.config 是本次请求的相关配置信息对象
      return request(error.config)
    } catch (error) {
      // 刷 token都失败了，相当于refresh_token都无效，直接跳转至登录页
      redirectLogin()
    }

  }else if(status === 403 ){
    //没有权限操作
    Toast.fail('没有权限操作')
  }else if(status > 500 ){
    //没有权限操作
    Toast.fail('服户端异常，请稍后重试')
  }

  return Promise.reject(error); //抛出异常
});

// 跳转至登录页面
function redirectLogin(){
  router.replace({
    name: 'login', //跳转至login路由
    // 查询参数 /login?redirect= 当前路径
    query: {
      // 通过一个查询参数，记录当前离开页面路径，跳转到你要进入页面，页面上url上有查询参数
      // currentRoute当前路由对应的路由信息对象。
      redirect: router.currentRoute.fullPath //fullPath完成解析后的 URL，包含查询参数和 hash 的完整路径。
    }
  })
}

//导出axios 实例对象
export default request