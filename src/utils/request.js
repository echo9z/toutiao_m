/**
 * 请求模块
 */
import axios from 'axios'
import store from '@/store'
import jsonBig from 'json-bigint'

export const baseURL = 'http://toutiao.itheima.net/'

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
  return response;
},function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


//导出axios 实例对象
export default request