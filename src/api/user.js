// 用户请求相关模块
import request from '@/utils/request'

export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    // params: {},  //Query查询参数
    data
  })
}
export const Code = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}
