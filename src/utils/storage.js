/**
 * 本地存储封装模块
 */
export const getItem = (key) => {
  const data = window.localStorage.getItem(key)
  // 为什么要把 JSON.parse 放到 try-catch中？原因是data可能不是 JSON格式字符串
  try {
    // 尝试把data 转换为 js对象
    return JSON.parse(data)
  } catch (error) {
    // 不是json格式对象，则直接返回data对象
    return data
  }
}

export const setItem = (key,val) => {
  //如果val 传过来的值是一个对象，则需要转换为字符串对象
  if(typeof val === 'object'){
    val = JSON.stringify(val)
  }
  window.localStorage.setItem(key,val)
}

export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}
