/**
 * 请求模块
 */
import axios from 'axios'
import store from '@/store'
const request = axios.create({
  timeout:3000, //请求3s 超时时间，前端久认为服务异常
  baseURL:'http://toutiao.itheima.net/' //配置请求根路径
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
  return response;
},function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


//导出axios 实例对象
export default request