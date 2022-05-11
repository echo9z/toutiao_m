/**
 * 初始化Dayjs相关配置
 */
import Vue from 'vue'
// 加载dayjs
import * as dayjs from 'dayjs'

// 配置中文国际化
import 'dayjs/locale/zh-cn' 
// 加载中文语言包 全局使用
dayjs.locale('zh-cn') // use locale globally

// 添加相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 拓展 相对时间函数
dayjs.extend(relativeTime) 

Vue.filter('relativeTime',value => {
  return dayjs(value).from(dayjs())
})

Vue.filter('dataTime',(value,format = 'YYYY/MM/DD HH:mm:dd') => {
  return dayjs(value).format(format)
})

export const getFormatDate = (date,format) => {
  return dayjs(date).format(format)
}
// //格式化 时间
// console.log(dayjs().format('YYYY/MM/DD HH:mm:dd'));

// // 相对时间
// console.log(dayjs('2022-4-28').from(dayjs()));
