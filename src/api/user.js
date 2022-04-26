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