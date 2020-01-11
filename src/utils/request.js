import axios from 'axios'
import jsonBig from 'json-bigint'
// 在非组件模块中直接加载获取容器 这里拿到的store和你在组建中访问this.$store是一个东西
import store from '@/store'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'// 基础路径

})

request.defaults.transformResponse = [function (data) {
  try {
    return jsonBig.parse(data)
  } catch (err) {
    return {}
  }
}]

// 请求拦截器
request.interceptors.request.use(function (config) {
  // config 请求配置对象，可以通过config来实现统一请求数据处理
  const { user } = store.state
  // 统一添加token
  if (user) {
    // config。headers 获取操作请求头对象
    // Authorization 是后端要求的字段名称
    // 数据值后端要求提供：Bearer token数据
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

export default request
