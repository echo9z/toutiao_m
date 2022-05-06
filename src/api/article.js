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

/**
 * 获取文章详情
 */
export const getArticleId = articleId =>{
  return request({
    method: "get",
    url: `/v1_0/articles/${articleId}`,
  })
}

/**
 * 文章收藏
 */
export const addCollectionsArticle = articleId =>{
  return request({
    method: "post",
    url: '/v1_0/article/collections',
    data: {
      target: articleId
    }
  })
}
/**
 * 取消文章收藏
 */
export const delCollectionsArticle = articleId =>{
  return request({
    method: "delete",
    url: `/v1_0/article/collections/${articleId}`,
  })
}
/**
 * 文章点赞
 */
export const addLikeArticle = articleId =>{
  return request({
    method: "POST",
    url: `/v1_0/article/likings`,
    data: {
      target: articleId
    }
  })
}
/**
 * 取消文章点赞
 */
export const delLikeArticle = articleId =>{
  return request({
    method: "DELETE",
    url: `/v1_0/article/likings/${articleId}`,
  })
}