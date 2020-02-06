import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
import decodeJwt from 'jwt-decode'
// 为了方便改存储的名字，所以定义一个变量
const KEY = 'user'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // {token,refresh_token}
    // user: JSON.parse(window.localStorage.getItem('user'))// 当前登录用户状态（token）
    user: getItem(KEY),
    cachePages: ['TabBar']
  },
  mutations: {
    setUser (state, data) {
      // 解析jwt中的数据（需要使用用户id）
      if (data && data.token) {
        // console.log(decodeJwt(data.token))
        data.id = decodeJwt(data.token).user_id
      }
      state.user = data
      // 为了避免页面刷新数据丢失，我们这里使用本地存储进行持久化
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      setItem(KEY, state.user)
    },
    // 添加缓存页面
    addCachePage (state, name) {
      if (!state.cachePages.includes(name)) {
        state.cachePages.push(name)
      }
    },
    // 移除缓存页面
    removeCachePage (state, name) {
      const index = state.cachePages.indexOf(name)
      if (index !== -1) {
        state.cachePages.splice(index)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
