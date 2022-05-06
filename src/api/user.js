// 用户请求模块
// 加载request请求模块
import request from "@/utils/request";

/**
 * 登录注册
 */
export const login = (data) => {
  return request({
    method: "post",
    url: "/v1_0/authorizations",
    data
  })
}

/**
 * 短信发送验证码
 */
export const sendSms = mobile => {
  return request({
    method: "get",
    url: `/v1_0/sms/codes/${mobile}`,
  })
}
//获取登录用户信息
export const getCurrentUser = mobile => {
  return request({
    method: "get",
    url: `/v1_0/user`,
  })
}

/**
 * 关注用户 
 */
export const addFollowUser = userId => {
  return request({
    method: "POST",
    url: `/v1_0/user/followings`,
    data: {
      target: userId
    }
  })
}
/**
 * 取消关注用户
 */
export const delFollowUser = userId => {
  return request({
    method: "DELETE",
    url: `/v1_0/user/followings/${userId}`,
  })
}