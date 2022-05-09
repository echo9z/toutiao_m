/**
 * 文章评论相关请求模块
 */
import request from "@/utils/request";

/**
 * 获取评论或评论回复
 */
export const getComments = params =>{
  return request({
    method: "get",
    url: '/v1_0/comments',
    params
  })
}
/**
 * 对评论或评论回复点赞
 * target 点赞的评论id
 */
export const addCommentLike = commentId =>{
  return request({
    method: "POST",
    url: '/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}
/**
 * 取消对评论或评论回复点赞
 * target 点赞的评论id
 */
export const delCommentLike = commentId =>{
  return request({
    method: "DELETE",
    url: `/v1_0/comment/likings/${commentId}`,
  })
}
/**
 * 对文章进行评论 或者对于其他用户发布的评论进行评论
 */
export const addComment = data =>{
  return request({
    method: "POST",
    url: '/v1_0/comments',
    data
  })
}