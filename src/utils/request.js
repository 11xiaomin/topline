import axios from 'axios'
import jsonBig from 'json-bigint'
// 在非组件模块中直接加载获取容器 这里拿到的store和你在组建中访问this.$store是一个东西
import store from '@/store'
import router from '@/router'

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
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response && error.response.status === 401) {
    // 1.如果没有 refresh_token 则直接跳转登录页
    const user = store.state.user
    if (!user || !user.refresh_token) {
      redirectLogin()
      return
    }
    // 2.如果有，则请求更新token
    // 不用request，用axios
    try {
      const { data } = await axios({
        method: 'PUT',
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })

      // console.log(data)
      // 3.如果刷新token成功，则把新的token更新到容器中
      store.commit('setUser', {
        ...user, // 原来的数据不变
        token: data.data.token// 更新token
      })
      // 4.把之前失败的请求继续发出去
      return request(error.config)
    } catch (error) {
      console.log('刷新 token 失败', error)
      redirectLogin()
    }
  }
  return Promise.reject(error)
})
function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
