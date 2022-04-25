/**
 * 请求模块
 */
import axios from 'axios'
const request = axios.create({
  timeout:3000, //请求3s 超时时间，前端久认为服务异常
  baseURL:'http://toutiao.itheima.net/' //配置请求根路径
})

//请求拦截器

//响应拦截器

//导出axios 实例对象
export default request