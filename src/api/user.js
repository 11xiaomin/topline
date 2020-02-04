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

// 获取当前登录用户个人信息
export const getUser = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}

// 获取指定用户信息
export const getUserById = userId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/users/${userId}`
  })
}

// 关注用户
export const addFollow = usreId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: usreId
    }
  })
}
// 取消关注用户
export const deleteFollow = usreId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${usreId}`
  })
}

// 获取用户资料
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

// 更新用户头像
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}

// 更新用户资料
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}
