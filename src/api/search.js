/**
 * 搜索请求相关模块
 */
import request from "@/utils/request"
/**
 * 获取搜索联系关键词建议
 */
export const getSearchSuggestion = query => {
  return request({
    method: 'GET',
    url:'/v1_0/suggestion',
    params: {
      q:query
    }
  })
}

/**
 * 获取搜索结果
 */
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url:'/v1_0/search',
    params
  })
}