import request from "@/utils/request";

/**
 * 根据token获取用户频道列表
 */
export const getUserChannels = () => {
  return request({
    method: "get",
    url: "/v1_0/user/channels",
  })
}

/**
 * 获取所有频道列表
 */
export const getAllChannels = () => {
  return request({
    method: "get",
    url: "/v1_0/channels"
  })
}

/**
 * 获取所有频道列表 这个用于用户处于登录时，用户对频道进行添加，数据出道服务器，用户切换新的设备一样式原油编辑频道数据，即数据持久化
 */
export const addUserChannels = (data) => {
  return request({
    method: "patch",
    url: "/v1_0/user/channels",
    data
  })
}
/**
 * 删除指定用户频道
 */
export const delUserChannels = id => {
  return request({
    method: "DELETE",
    url: `/v1_0/user/channels/${id}`,
  })
}