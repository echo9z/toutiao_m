/**
 * 建立socket.io 连接
 */
import io from "socket.io-client";
import store from '@/store'
import {baseURL} from '@/utils/request'

export const createdSocket = () =>{
  return new Promise((resolve) => {
    const socket = io(baseURL,{ // 建立与服务端进行数据通信
      query: {
        token: store.state.user.token
      },
      transports: ['websocket']
    });   
    resolve(socket) 
  })
}
