/**
 * article 获取文章请求模块
 */
import request from "@/utils/request";
/**
 * 获取文章列表
 */
export const getArticles = (params) =>{
  console.log(params);
  return request({
    method: "get",
    url: "/v1_0/articles",
    params
  })
}